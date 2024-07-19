import { format } from "date-fns";
import { FieldValue } from "firebase-admin/firestore";
import { db, dbGB } from "../../firebase/firebase.cjs";

export default async function deleteSale(req, res) {
  const { idFactura, hashId, eventId, email } = req.body;


  if (!(idFactura || hashId)) {
    res.send({
      message:
        "lo siento pero el id de la factura es requerido o el hashId de ta transacion",
      isSucces: false,
    });
    return;
  }

  let isNotExitSaleNumber;
  let idToDeleteRef;
  let tablesToReplenish = {};

  try {
    await db.runTransaction(async (t) => {
      if (hashId) {
        console.log("si hay un has id");

        idToDeleteRef = db
          .collection("events")
          .doc(eventId)
          .collection("sales")
          .doc(hashId);
      } else {
        console.log("obteniendo el id de la referencia");
        const facturaQuery = db
          .collection("events")
          .doc(eventId)
          .collection("sales")
          .where("idFactura", "==", idFactura)
          .limit(1);
        const result = await facturaQuery.get();
        // console.log(result)
        if (result.empty) {
          console.log("no hay datos");
          isNotExitSaleNumber = true;
          return;
        } else {
          console.log("hay datos");
          idToDeleteRef = db
            .collection("events")
            .doc(eventId)
            .collection("sales")
            .doc(result.docs[0].id);
        }
      }

      const billToDeleteResul = await t.get(idToDeleteRef);

      if (billToDeleteResul.exists) {
        //obtenemos la factura  a eliminar
        console.log(billToDeleteResul.data());
        // obtenemos los tiket asociado a la factura

        const { boletos, numeroDeFactura, fecha } = billToDeleteResul.data();

        // eliminamos de tiket sol y revertimos de los places

        for (let boleto of boletos) {
          if (boleto.silla) {
            const tikeToDeleteRef = db
              .collection("events")
              .doc(eventId)
              .collection("tickets-sold")
              .doc(boleto.silla);
            let tiketToUpdateRef;

            const tiketToUpdateRefBeta = db
              .collection("events")
              .doc(eventId)
              .collection("chairs-place")
              .doc(boleto.silla);

            const tiketResulBeta = await tiketToUpdateRefBeta.get();

            if (tiketResulBeta.exists) {
              tiketToUpdateRef = tiketToUpdateRefBeta;
            } else {
              tiketToUpdateRef = db
                .collection("events")
                .doc(eventId)
                .collection("chairs")
                .doc(boleto.silla);
            }

            const chairControlRef = db
              .collection("events")
              .doc(eventId)
              .collection("chairs-controls")
              .doc(boleto.silla);

            t.delete(tikeToDeleteRef);
            t.update(tiketToUpdateRef, { estado: "ok" });
            t.update(chairControlRef, {
              estado: "ok",
              reason: FieldValue.delete(),
              refTransaction: FieldValue.delete(),
              updatedBy: FieldValue.delete(),
            });
          } else if (boleto.tiketId) {
            console.log("es un lugar de pie XD");

            const tikectsToDeleteRef = db
              .collection("events")
              .doc(eventId)
              .collection("tickets-sold")
              .doc(boleto.tiketId);

            const generalTiketToUpdateRef = db
              .collection("events")
              .doc(eventId)
              .collection("general-place")
              .doc(boleto.tiketId);

            t.delete(tikectsToDeleteRef);
            t.update(generalTiketToUpdateRef, {
              estado: "ok",
            });
          }
          if (boleto.mesa)
            tablesToReplenish[boleto.mesa] = tablesToReplenish[boleto.mesa]
              ? tablesToReplenish[boleto.mesa] + 1
              : 1;
        }
        console.log(fecha._seconds * 1000);

        const formatDate = format(
          new Date(fecha._seconds * 1000),
          "dd-LL-uuuu"
        );
        const facturasRef = db
          .collection("reportes-diarios")
          .doc("reporte-diario")
          .collection(formatDate)
          .doc(numeroDeFactura);
        t.delete(facturasRef);

        const salesBkRef = db
          .collection("sales-back-up")
          .doc(eventId)
          .collection("sales")
          .doc(billToDeleteResul.id);

        const bdRefCancelledInvoices = db
          .collection("events")
          .doc(eventId)
          .collection("cancelled-invoices")
          .doc(hashId);

          console.log('email',email)

        t.set(bdRefCancelledInvoices, { ...billToDeleteResul.data(), authorizedUser: email, cancellationDate: new Date() });
        t.delete(salesBkRef);
        t.delete(idToDeleteRef);
        console.log("eliminado");
      }

      // indemprndientemente de los datos que provee la api tiene 2 parametro de entrada 1 el hash id de la transacion y el
      // o el numero de la factura este primero es importante ya que toda la operacion se mueve por el hash
    });

    console.log("silla a reponer");
    console.log(tablesToReplenish);

    for (let key in tablesToReplenish) {
      const tableRef = dbGB
        .collection("events")
        .doc(eventId)
        .collection("tables")
        .doc(key);
      await tableRef.update({
        Disponible: FieldValue.increment(tablesToReplenish[key]),
      });
    }
  } catch (error) {
    console.log("ocurrion un  error");
    console.log(error);
  }

  //   console.log (isNotExitSaleNumber);

  if (isNotExitSaleNumber) {
    res.send({
      message: "lo siento per la reerencia nu es valida",
      isSucces: false,
    });
    return;
  }

  res.send({
    isSucces: true,
    message: "exito factura elimina",
  });
}
