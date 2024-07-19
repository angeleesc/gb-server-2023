import { db } from "../../firebase/firebase.cjs";
import { v4, v1 } from "uuid";
import { format, } from "date-fns-tz";
import utcToZonedTime from 'date-fns-tz/utcToZonedTime'
import { FieldValue } from "firebase-admin/firestore";
import { generateUniQueEventFacturation } from "../../utils/uniueHasGenerator.js";

const ticketSold = async (req, res) => {
  // primero obtenemos los datos a cancelar

  // console.log(req.body);

  const {
    eventId,
    placeRecerve,
    byPlaceSelected,
    fecha: dateFrom,
    userId,
    cantidad,
    zona,
    lugarDeVenta,
    metodoDePago,
    vendedor,
    referenciaDePagoDePsarela,
    DatosDelComprador,
    generalPlaceRecerved,
    refId,
    asociatedId,
    refundProtection
  } = req.body;


  // obtenemos las referencia de la colleciones proximas a modificar

  let fecha;

  if (dateFrom) {
    fecha = new Date(dateFrom);
  } else {
    fecha = new Date();
  }

  const fechaVE = utcToZonedTime(fecha, 'America/Caracas')
  console.log('fecha server', fecha)
  console.log('fechave', fechaVE)

  const eventRef = db.collection("events").doc(eventId);
  const placesSodREf = db
    .collection("events")
    .doc(eventId)
    .collection("chairs");
  const charisControlRef = db
    .collection("events")
    .doc(eventId)
    .collection("chairs-controls");
  const tiketsSolRef = db
    .collection("events")
    .doc(eventId)
    .collection("tickets-sold");
  const controlDeFactura = db
    .collection("events")
    .doc(eventId)
    .collection("billings");
  const generalPlacesRef = db
    .collection("events")
    .doc(eventId)
    .collection("general-place");
  const placeTableRef = db
    .collection("events")
    .doc(eventId)
    .collection("tables");
  const salesRef = db.collection("events").doc(eventId).collection("sales");
  const tasaRef = db.collection("utils").doc("dollar");
  const tasa = (await tasaRef.get()).data().tasa;

  console.log("tasa", tasa);

  // iniciamos la trasacion

  try {
    let datosGeneralesDelaVenta;
    let idDeLaVenta;
    let numeracionDeFacturaDeVenta;
    let discountProperties = {}
    let discountedAmount = 0
    await db.runTransaction(async (t) => {
      const eventFullData = (await t.get(eventRef)).data();


      let asociatedData = null;
      let commissioByAffiliateCode = null
      if (asociatedId) {

        const asociatedDataRef = db
          .collection("events-logitict")
          .doc(eventId)
          .collection("affiliatePartners")
          .doc(asociatedId);
        const asociatedResult = await asociatedDataRef.get()

        if (asociatedResult.exists) {
          if (asociatedResult.data().planProperties.typeOfCommission === "Fixed") {
            discountProperties = {
              affiliateCommission: asociatedResult.data().planProperties.affiliateCommission,
              customerDiscount: asociatedResult.data().planProperties.customerDiscount,
              typeOfCommission: asociatedResult.data().planProperties.typeOfCommission
            }
            const orderInRequest = generalPlaceRecerved ? generalPlaceRecerved.length !== 0 ? generalPlaceRecerved : placeRecerve : placeRecerve
            discountedAmount = asociatedResult.data().planProperties.customerDiscount * orderInRequest.length
          }
        }

        if (asociatedResult.exists) asociatedData = asociatedResult.data();
      }

      // generamos el id de la trasacion

      let serialDeFactura;
      let isUnique = false;

      // validamos si es el unico id de la trasancion porsia

      while (!isUnique) {
        serialDeFactura = generateUniQueEventFacturation();
        const validData = await controlDeFactura.doc(serialDeFactura.id).get();
        if (!validData.exists) isUnique = true;
      }


      const billId = "N-" + serialDeFactura.timed + '-' + serialDeFactura.lastTenDiginId;
      numeracionDeFacturaDeVenta = billId;

      const hashId = serialDeFactura.id;
      const formatDate = format(fechaVE, "dd-LL-uuuu", { timeZone: 'America/Caracas' });
      const facturasRef = db
        .collection("reportes-diarios")
        .doc("reporte-diario")
        .collection(formatDate)
        .doc(billId);

      // obtenemos los datos desde

      let precioTotal = 0;

      // obtenemos la fechas actual

      let tiketsData = [];
      let bill = {};
      let total = {};
      let placesOfTablesSoldCounter = {};

      if (byPlaceSelected) {
        if (placeRecerve && Array.isArray(placeRecerve)) {
          console.log("agregando datos de puestos vip o sillas estatica");

          let vip = {};

          vip.precioUnitario = placeRecerve[0].price;
          vip.ivaUnitario = placeRecerve[0].IVA;
          vip.IMPMunicipalUnitario = placeRecerve[0].impMunicipal;
          vip.servicioTaquillaUnitario = placeRecerve[0].servicioDeTaquilla;
          vip.netoUnitatio = placeRecerve[0].basePrice;
          vip.precioBase = placeRecerve[0].basePrice;
          vip.cantidad = placeRecerve.length;

          // calculamos el precio total

          vip.precioTotal = (vip.precioUnitario * vip.cantidad).toFixed(2);
          vip.ivaTotal = (vip.ivaUnitario * vip.cantidad).toFixed(2);
          vip.totalIMPMunicipalUnitario = (
            vip.IMPMunicipalUnitario * vip.cantidad
          ).toFixed(2);
          vip.totalServicioDETaquilla = (
            vip.servicioTaquillaUnitario * vip.cantidad
          ).toFixed(2);
          vip.netoTotal = (vip.netoUnitatio * vip.cantidad).toFixed(2);
          vip.precioBaseTotal = vip.netoTotal;

          total.precioTotal = vip.precioTotal;
          total.ivaTotal = vip.ivaTotal;
          total.IMPMunicipalTotal = vip.IMPMunicipalTotal;
          total.servicioTaquillaTotal = vip.totalServicioDETaquilla;
          total.netoTotal = vip.netoTotal;
          bill.vipPlaces = vip;

          const tablesSet = new Set()


          for (let place of placeRecerve) {
            //bloqueamos los lugares
            const { id } = place;

            const placeToBlockRef = placesSodREf.doc(id);
            const chairControlRef = charisControlRef.doc(id);

            t.update(placeToBlockRef, {
              estado: "block",
              expirationTime: FieldValue.delete(),
              reservatioId: FieldValue.delete(),
            });

            t.update(chairControlRef, {
              estado: "block",
              reason: "sale",
              refTransaction: billId,
              updatedBy: lugarDeVenta,
            });

            const tiketSolRef = tiketsSolRef.doc(id);
            const dateSerial = v1();
            const ticketSerial = v4();

            const tiketData = {
              ...place,
              eventId,
              isPrinted: true,
              dateSerial,
              ticketSerial,
              zona: place.zona,
              fila: place.fila,
              numeroDeFactura: billId, // nuevo campo
              idFactura: billId, // nuevo campo
              hashId, // nuevo campo
              silla: id,
              tiketId: id,
              precio: place.price,
              precioBase: vip.netoUnitatio,
              iva: vip.ivaUnitario,
              impuestoMunicipal: vip.IMPMunicipalUnitario,
              servicioDeTaquilla: vip.servicioTaquillaUnitario,
              total: vip.precioUnitario,
            };

            if (tiketData.mesa) {
              tiketData.mesa = place.mesa;

              placesOfTablesSoldCounter[place.mesa] = placesOfTablesSoldCounter[
                place.mesa
              ]
                ? placesOfTablesSoldCounter[place.mesa] + 1
                : 1;
            }

            // console.log(placesOfTablesSoldCounter)



            if (eventFullData.title) tiketData.eventName = eventFullData.title;
            if (eventFullData.date) {
              tiketData.date = eventFullData.date;
              // console.log();
              tiketData.FormatDate = format(
                new Date(eventFullData.date._seconds * 1000),
                "MMMM d"
              );
            }
            if (eventFullData.time) {
              tiketData.time = eventFullData.time;
              tiketData.formatTime = format(
                new Date(eventFullData.time._seconds * 1000),
                "hh:mm a"
              );
            }
            t.set(tiketSolRef, tiketData);
            tiketsData.push(tiketData);
            precioTotal += place.price;
          }

          console.log(placesOfTablesSoldCounter)

          for (let tableKey in placesOfTablesSoldCounter) {
            console.log("mesas a descontar");
            console.log(tableKey, ":", placesOfTablesSoldCounter[tableKey]);

            t.update(placeTableRef.doc(tableKey), {
              Disponible: FieldValue.increment(
                -1 * placesOfTablesSoldCounter[tableKey]
              ),
            });
          }
        }

        if (generalPlaceRecerved && Array.isArray(generalPlaceRecerved)) {
          console.log("generando tiket para boletos genrales");

          let general = {};

          general.precioUnitario = generalPlaceRecerved[0].price;
          general.ivaUnitario = generalPlaceRecerved[0].IVA;
          general.IMPMunicipalUnitario = generalPlaceRecerved[0].impMunicipal;
          general.servicioTaquillaUnitario =
            generalPlaceRecerved[0].servicioDeTaquilla;
          general.netoUnitatio = generalPlaceRecerved[0].basePrice;
          general.precioBase = generalPlaceRecerved[0].basePrice;
          general.cantidad = generalPlaceRecerved.length;

          general.precioTotal = (
            general.precioUnitario * general.cantidad
          ).toFixed(2);
          general.ivaTotal = (general.ivaUnitario * general.cantidad).toFixed(
            2
          );

          general.totalIMPMunicipalUnitario = (
            general.IMPMunicipalUnitario * general.cantidad
          ).toFixed(2);
          general.IMPMunicipalTotal = (
            general.IMPMunicipalUnitario * general.cantidad
          ).toFixed(2);
          general.totalServicioDETaquilla = (
            general.servicioTaquillaUnitario * general.cantidad
          ).toFixed(2);
          general.netoTotal = (general.netoUnitatio * general.cantidad).toFixed(
            2
          );
          general.precioBaseTotal = general.netoTotal;

          total.precioTotal = total.precioTotal
            ? total.precioTotal + general.precioTotal
            : general.precioBaseTotal;

          total.ivaTotal = total.ivaTotal
            ? general.ivaTotal + total.ivaTotal
            : general.ivaTotal;

          total.servicioTaquillaTotal = total.servicioTaquillaTotal
            ? total.servicioTaquillaTotal + general.totalServicioDETaquilla
            : general.totalServicioDETaquilla;
          total.netoTotal = total.netoTotal
            ? total.netoTotal + general.netoTotal
            : general.netoTotal;

          total.IMPMunicipalTotal = total.IMPMunicipalTotal
            ? general.IMPMunicipalTotal + total.IMPMunicipalTotal
            : general.IMPMunicipalTotal;

          bill.generalPlace = general;

          bill.total = total;

          console.log("factura", bill);

          for (let place of generalPlaceRecerved) {
            const { id } = place;
            const generaPlaceDocRef = generalPlacesRef.doc(id);

            // llevamos el controls de la cuenta

            t.update(generaPlaceDocRef, {
              estado: "block",
              expirationTime: FieldValue.delete(),
              reservatioId: FieldValue.delete(),
            });

            const tiketSolRef = tiketsSolRef.doc(id);

            const dateSerial = v1();
            const ticketSerial = v4();

            const tiketData = {
              eventId,
              dateSerial,
              ticketSerial,
              tiketId: place.id,
              precio: place.price,
              numeroDeFactura: billId, // nuevo campo
              idFactura: billId, // nuevo campo
              hashId, // nuevo campo
              zona: place.zona,
              precioBase: general.netoUnitatio,
              iva: general.ivaUnitario,
              impuestoMunicipal: general.IMPMunicipalUnitario,
              servicioDeTaquilla: general.servicioTaquillaUnitario,
              total: general.precioUnitario,
            };

            if (eventFullData.title) tiketData.eventName = eventFullData.title;
            if (eventFullData.date) {
              tiketData.date = eventFullData.date;
              // console.log();
              tiketData.FormatDate = format(
                new Date(eventFullData.date._seconds * 1000),
                "MMMM d"
              );
            }
            if (eventFullData.time) {
              tiketData.time = eventFullData.time;
              tiketData.formatTime = format(
                new Date(eventFullData.time._seconds * 1000),
                "hh:mm a"
              );
            }

            t.set(tiketSolRef, tiketData);
            tiketsData.push(tiketData);
            precioTotal += place.price;

            console.table(tiketData);
          }
        }
      } else {
        for (let i = 0; i < cantidad; i++) {
          const ticketSerial = v4();
          const dateSerial = v1();
          const newTicketRef = tiketsSolRef.doc(dateSerial);

          const tiketData = {
            ticketSerial,
            dateSerial,
            zona,
          };
          if (eventFullData.title) tiketData.eventName = eventFullData.title;
          if (eventFullData.date) {
            tiketData.date = eventFullData.date;
            // console.log();
            tiketData.FormatDate = format(
              new Date(eventFullData.date._seconds * 1000),
              "MMMM d"
            );
          }
          if (eventFullData.time) {
            tiketData.time = eventFullData.time;
            tiketData.formatTime = format(
              new Date(eventFullData.time._seconds * 1000),
              "hh:mm a"
            );
          }

          t.set(newTicketRef, tiketData);
          tiketsData.push(tiketData);
        }
      }

      // procedemosn a regirtar los datos

      // generamoslos datos del tikect vendido

      // regitramos los datos de facturacion

      const formatFacturationDate = format(fechaVE, "MMMM d", { timeZone: 'America/Caracas' });
      const formatTime = format(fechaVE, "HH:mm:ss", { timeZone: 'America/Caracas' });
      const datosDeFactura = {
        eventId,
        fecha: fechaVE,
        formatFacturationDate,
        formatTime,
        numeroDeFactura: billId, // nuevo campo
        idFactura: billId, // nuevo campo
        hashId, // nuevo campo
        // descripcion: eventFullData.title,
        lugarDeVenta,
        metodoDePago,
        vendedor,
        referenciaDePago: referenciaDePagoDePsarela,
        referenciaDePagoDePsarela,
        bill,
      };

      // console.log(serialDeFactura);

      t.set(controlDeFactura.doc(serialDeFactura.id), datosDeFactura);

      // generamos el valor de la venta

      const datoDeLaVenta = {
        eventId,
        // descripcion: eventFullData.title,
        fecha,
        boletos: tiketsData,
        numeroDeFactura: billId, // nuevo campo
        idFactura: billId, // nuevo campo
        hashId, // nuevo campo
        precioTotal,
        vendedor,
        formatFacturationDate,
        formatTime,
        metodoDePago,
        referenciaDePago: referenciaDePagoDePsarela,
        impresiones: 0,
        lugarDeVenta,
        bill,
        tasaDelDolarToBs: tasa,
        saleTag: serialDeFactura
      };

      datosGeneralesDelaVenta = datoDeLaVenta;

      if (refundProtection) {
        const refundProtectionAmountInDb = await (await db.collection("utils").doc("refundProtection").get()).data().refundProtection
        if (refundProtectionAmountInDb) {
          datoDeLaVenta.refundProtection = true
          datoDeLaVenta.refundProtectionAmount = parseFloat(Number(precioTotal * (refundProtectionAmountInDb * tiketsData.length)).toFixed(2))
        }
      }

      if (asociatedData) {
        datoDeLaVenta.discountedAmount = discountedAmount
        datoDeLaVenta.discountProperties = discountProperties
      }

      if (DatosDelComprador && Object.keys(DatosDelComprador).length > 0)
        datoDeLaVenta.comprador = DatosDelComprador;

      if (refId) datoDeLaVenta.refId = refId;
      if (asociatedData) datoDeLaVenta.asociatedId = asociatedId;

      t.set(salesRef.doc(serialDeFactura.id), datoDeLaVenta);

      if (asociatedData) {
        const { userId: userAffiliatePartnersId } = asociatedData;

        const userAffiliatePartnersRef = db
          .collection("users")
          .doc(userAffiliatePartnersId)
          .collection("affiliatePartners")
          .doc(asociatedId)
          .collection("sales")
          .doc(serialDeFactura.id);

        t.set(userAffiliatePartnersRef, datoDeLaVenta);

        t.set(
          db
            .collection("events-logitict")
            .doc(eventId)
            .collection("affiliatePartners")
            .doc(asociatedId)
            .collection("sales")
            .doc(serialDeFactura.id),
          datoDeLaVenta
        );
      }

      if (refId)
        t.set(
          db
            .collection("events-logitict")
            .doc(eventId)
            .collection("referrals")
            .doc(refId)
            .collection("sales")
            .doc(serialDeFactura.id),
          datoDeLaVenta
        );

      idDeLaVenta = serialDeFactura.id;

      if (userId) {
        t.set(
          db
            .collection("users")
            .doc(userId)
            .collection("personal-transaction")
            .doc(serialDeFactura.id),
          datoDeLaVenta
        );
      }

      t.set(facturasRef, datoDeLaVenta);
      const salesBkRef = db
        .collection("sales-back-up")
        .doc(eventId)
        .collection("sales")
        .doc(serialDeFactura.id);

      t.set(salesBkRef, datoDeLaVenta);


      console.log(tiketsData);
    });
    res.send({
      message: "Vendido XD recuerda cepillar tus diente todo el dia",
      datosGeneralesDelaVenta,
      idDeLaVenta,
      numeracionDeFacturaDeVenta,
    });
    return;
  } catch (error) {
    console.error(error);
  }
  res.send({ message: "operacion fallida perdiste la plata XC" });
};

export default ticketSold;
