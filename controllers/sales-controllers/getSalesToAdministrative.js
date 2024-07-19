import { db } from "../../firebase/firebase.cjs";

const metodoDePagoBs = [
  {
    name: "Punto de venta",
    key: "puntoDeVenta",
  },
  {
    name: "Pago movil",
    key: "pagoMovil",
  },
  {
    name: "Debito Ahorro Vnzla",
    key: "Debito Ahorro Vnzla",
  },
  {
    name: "Debito Corriente Vnzla",
    key: "Debito Corriente Vnzla",
  },
  {
    name: "Transferencia Vnzla",
    key: "vzlaTransfer",
  },
  {
    name: "Credito mastercard Vnzla",
    key: "Credito Mastercard Vnzla",
  },
  {
    name: "Credito visa Vnzla",
    key: "Credito Visa Vnzla",
  },

  {
    name: "Monedero patria",
    key: "Monedero Patria",
  },
  {
    name: "Efectivo Bs",
    key: "efectivoBs",
  },
];
const getSalesToAdministrative = async (req, res) => {
  const eventsQuery = db.collection("events");
  const eventResult = await eventsQuery.get();

  function toFixed(num, fixed) {
    // console.log(num)
    if (!isNaN(num)) {
      var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
      return num?.toString().match(re)[0];
    }
  }

  function totalBySaleBilling(x, dataEventProp, arrLockerServiceIn) {
    const metodoDePagoBs = [
      {
        name: "Punto de venta",
        key: "puntoDeVenta",
      },
      {
        name: "Pago movil",
        key: "pagoMovil",
      },
      {
        name: "Debito Ahorro Vnzla",
        key: "Debito Ahorro Vnzla",
      },
      {
        name: "Debito Corriente Vnzla",
        key: "Debito Corriente Vnzla",
      },
      {
        name: "Transferencia Vnzla",
        key: "vzlaTransfer",
      },
      {
        name: "Credito mastercard Vnzla",
        key: "Credito Mastercard Vnzla",
      },
      {
        name: "Credito visa Vnzla",
        key: "Credito Visa Vnzla",
      },

      {
        name: "Monedero patria",
        key: "Monedero Patria",
      },
      {
        name: "Efectivo Bs",
        key: "efectivoBs",
      },
    ];

    const metodoBs = metodoDePagoBs?.map((x) => x.key);

    const arrmetodoDollars = [
      "binance",
      "zelle",
      "zinli",
      "efectivo",
      "reserve ",
      "tarjetaDeCredito",
    ];
    // const arrmetodo = ["efectivoBs", "pagoMovil", "puntoDeVenta"];

    const arrBs = [];
    const arrDollars = [];
    const arrDollarsProductor = [];
    const arrBsProductor = [];
    const arrDollarsGlobalboletos = [];
    const arrBsGlobalboletos = [];
    const arrComisionDolares = [];

    const chargeBoxOfficeService = dataEventProp.chargeLockerServiceIn
      ? arrLockerServiceIn.some((y) => y === x.vendedor)
      : true;

    const serviceOfficeBoxUni = chargeBoxOfficeService
      ? Number(
          x.bill?.generalPlace
            ? x.bill?.generalPlace.servicioTaquillaUnitario
            : x.bill?.vipPlaces.servicioTaquillaUnitario
        )
      : 0;

    const isBs = metodoBs.some((z) => z === x.referenciaDePago);

    if (x.referenciaDePago === "multipagos") {
      const amountBsInBs = [];
      const amountDollarsInBs = [];

      metodoBs.forEach((y) => {
        const values = x.metodoDePago;
        if (values[y]) {
          if (values[y].value > 0) {
            arrBs.push(values[y].value * x.tasaDelDolarToBs);
            amountBsInBs.push(values[y].value);
          }
        }
      });

      arrmetodoDollars.forEach((y) => {
        const values = x.metodoDePago;
        if (values[y]) {
          if (values[y].value > 0) {
            arrDollars.push(values[y].value);
            amountDollarsInBs.push(values[y].value);
          }
        }
      });

      const amountTotalBsInMultipayment = amountBsInBs.reduce(
        (prev, curr) => prev + curr,
        0
      );
      const amountTotalDollarInMultipayment = amountDollarsInBs.reduce(
        (prev, curr) => prev + curr,
        0
      );

      const whereMoreAmount =
        amountTotalBsInMultipayment > amountTotalDollarInMultipayment
          ? "Bolivares"
          : "Dolares";

      const serviceOfficeBoxTotal = serviceOfficeBoxUni * x?.boletos?.length;

      if (amountTotalDollarInMultipayment > serviceOfficeBoxTotal) {
        arrDollarsProductor.push(
          amountTotalDollarInMultipayment -
            serviceOfficeBoxUni * x?.boletos?.length
        );
        arrBsProductor.push(x.tasaDelDolarToBs * amountTotalBsInMultipayment);
        arrDollarsGlobalboletos.push(serviceOfficeBoxUni * x?.boletos?.length);
      } else {
        if (whereMoreAmount === "Dolares") {
          arrDollarsProductor.push(
            amountTotalDollarInMultipayment -
              serviceOfficeBoxUni * x?.boletos?.length
          );
          arrBsProductor.push(x.tasaDelDolarToBs * amountTotalBsInMultipayment);
          arrDollarsGlobalboletos.push(
            serviceOfficeBoxUni * x?.boletos?.length
          );
        } else if (whereMoreAmount === "Bolivares") {
          arrBsProductor.push(
            x.tasaDelDolarToBs *
              (amountTotalBsInMultipayment -
                serviceOfficeBoxUni * x?.boletos?.length)
          );
          arrDollarsProductor.push(amountTotalDollarInMultipayment);
          arrBsGlobalboletos.push(
            x.tasaDelDolarToBs * (serviceOfficeBoxUni * x?.boletos?.length)
          );
        }
      }
    } else if (isBs) {
      arrBs.push(x.precioTotal * x.tasaDelDolarToBs);
      arrBsProductor.push(
        x.tasaDelDolarToBs *
          (x.precioTotal - serviceOfficeBoxUni * x?.boletos?.length)
      );
      arrBsGlobalboletos.push(
        x.tasaDelDolarToBs * (serviceOfficeBoxUni * x?.boletos?.length)
      );
    } else {
      if (x.referenciaDePago === "tarjetaDeCredito") {
        arrComisionDolares.push(x.precioTotal);
      }
      arrDollars.push(x.precioTotal);
      arrDollarsProductor.push(
        x.precioTotal - serviceOfficeBoxUni * x?.boletos?.length
      );
      arrDollarsGlobalboletos.push(serviceOfficeBoxUni * x?.boletos?.length);
    }

    const totaDollarsProductor = arrDollarsProductor.reduce(
      (prev, curr) => prev + curr,
      0
    );
    const totaBsProductor = arrBsProductor.reduce(
      (prev, curr) => prev + curr,
      0
    );
    const totaDollarsGlobalboletos = arrDollarsGlobalboletos.reduce(
      (prev, curr) => prev + curr,
      0
    );
    const totaBsGlobalboletos = arrBsGlobalboletos.reduce(
      (prev, curr) => prev + curr,
      0
    );

    const totalComisionDolares = arrComisionDolares.reduce(
      (prev, curr) => prev + curr,
      0
    );

    const totaDollars = arrDollars.reduce((prev, curr) => prev + curr, 0);
    const totalBs = arrBs.reduce((prev, curr) => prev + curr, 0);
    const totalBankCommissionBs = totalBs * 0.02;
    const totalBankCommissionDollars = totalComisionDolares * 0.01;

    return {
      totalDolares: totaDollars,
      totalBs: totalBs,
      totalComisionBancaria: totalBankCommissionBs,
      totalComisionBancariaDolares: totalBankCommissionDollars,
      totalDolaresProductor: totaDollarsProductor - totalBankCommissionDollars,
      totalBolivaresProductor: totaBsProductor - totalBankCommissionBs,
      totalDolaresGlobalboletos: totaDollarsGlobalboletos,
      totalBolivaresGlobalboletos: totaBsGlobalboletos,
    };
  }

  const refMethodsPayment = (sale) => {
    const arrMethodsInPayment = Object.keys(sale.metodoDePago);
    const refArr = [];

    arrMethodsInPayment.forEach((x) => {
      if (sale.metodoDePago[x]) {
        if (sale.metodoDePago[x].ref) refArr.push(sale.metodoDePago[x].ref);
      }
    });
    return refArr.length ? refArr.toString() : "Sin referencia";
  };

  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  const formatDateWithouTolocate = (item) => {
    return new Date((item?.seconds + item?.nanoseconds * 10 ** -9) * 1000);
  };

  if (eventResult) {
    // const placesData = [];

    const data = [];
    const eventId = [];

    const filterResult = eventResult.docs.filter(
      (x) =>
        monthDiff(
          new Date(
            formatDateWithouTolocate(x.data().date).getFullYear(),
            formatDateWithouTolocate(x.data().date).getMonth(),
            formatDateWithouTolocate(x.data().date).getDate()
          ),
          new Date()
        ) < 2
    );

    for (const event of filterResult) {
      const salesRef = db
        .collection("events")
        .doc(event.id)
        .collection("sales")
        .orderBy("fecha", "asc");

      const arrLockerServiceIn = event.data().chargeLockerServiceIn
        ? event.data().chargeLockerServiceIn
        : [];

      const salesResult = await salesRef.get();

      if (salesResult) {
        salesResult.docs.forEach((resSales) => {
          const el = resSales.data();
          
        //const date = formatDateWithouTolocate(el?.fecha)
        //const fechaToFilter = new Date(date.getFullYear(), date.getMonth(), Number(String(el.formatFacturationDate).split(" ")[1]))
          el.cedula = el.comprador.cedula;
          el.phone = el.comprador.phone;
          el.email = el.comprador.email;
          el.comprador = el.comprador.nombre;
          el.dateNormal= formatDateWithouTolocate(el?.fecha).toLocaleDateString('en-GB',{timeZone: "America/Caracas"}),
          el.fechaToFilterParse=resSales.data().fecha,
          el.fecha= formatDateWithouTolocate(el?.fecha).toLocaleDateString('en-GB',{timeZone: "America/Caracas"}),
          el.hora=formatDateWithouTolocate(resSales.data().fecha).toLocaleTimeString("es-ES", {
            hour: "numeric",
            hour12: true,
            minute: "numeric",
            timeZone: "America/Caracas"
          });
          el.totalBoletos = el?.boletos?.length;
          el.totalGlobal = toFixed(
            Number(
              totalBySaleBilling(el, event.data(), arrLockerServiceIn)
                .totalDolaresGlobalboletos
            ),
            2
          );
          el.totalGlobalBs = toFixed(
            Number(
              totalBySaleBilling(el, event.data(), arrLockerServiceIn)
                .totalBolivaresGlobalboletos
            ),
            2
          );
          el.facturaTransacction = refMethodsPayment(el);
          el.descuento = metodoDePagoBs.some(
            (x) => x.key === el.referenciaDePago
          )
            ? toFixed(
                totalBySaleBilling(el, event.data(), arrLockerServiceIn)
                  .totalComisionBancaria,
                4
              )
            : toFixed(
                totalBySaleBilling(el, event.data(), arrLockerServiceIn)
                  .totalComisionBancariaDolares,
                4
              );

          el.totalProductor = toFixed(
            totalBySaleBilling(el, event.data(), arrLockerServiceIn)
              .totalDolaresProductor,
            4
          );

          el.totalProductorBs = toFixed(
            totalBySaleBilling(el, event.data(), arrLockerServiceIn)
              .totalBolivaresProductor,
            4
          );
          el.tipoTicket = el?.boletos?.[0]?.zona;
          el.montoTotalDolares = totalBySaleBilling(
            el,
            event.data(),
            arrLockerServiceIn
          ).totalDolares;
          el.isPrint = el.isPrint
            ? el.isPrint
            : el.lugarDeVenta !== "globalboletos.com"
            ? true
            : el.lugarDeVenta === "globalboletos.com" && !el.isPrint && false;
          //    console.log(el)
          el.idFactura = el?.saleTag?.lastTenDiginId
            ? el.saleTag.lastTenDiginId
            : el.idFactura;
          el.status = el?.status
            ? el?.status
            : el.lugarDeVenta !== "globalboletos.com"
            ? "ENTREGADO"
            : el.lugarDeVenta === "globalboletos.com" &&
              !el.status &&
              "EN ESPERA";
          el.lugarDeVenta =
            el.lugarDeVenta === "complejoferial2"
              ? "SAMBIL"
              : el.lugarDeVenta === "complejoferial1"
              ? "TRINITARIAS"
              : el.lugarDeVenta === "complejoferial3"
              ? "METROPOLIS"
              : el.lugarDeVenta;
          el.montoTotalBs = totalBySaleBilling(
            el,
            event.data(),
            arrLockerServiceIn
          ).totalBs;

          data.push(el);
        });
      }
      eventId.push(event.id);
    }

    if (data) {
        const dataSales=data.sort((a,b)=>formatDateWithouTolocate(b?.fechaToFilterParse)-formatDateWithouTolocate(a?.fechaToFilterParse))
      res.send({ message: "exito", data:dataSales, eventId });
    }
  }
};

export default getSalesToAdministrative;
