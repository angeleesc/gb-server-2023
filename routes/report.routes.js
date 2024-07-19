import { Router } from "express";
import getAvailableZonesTicket from "../controllers/report-controllers/getAvailableZonesTicket.js";
import { db, dbGB } from "../firebase/firebase.cjs";

const routes = Router();

const checkOrder = async ({ isGeneral, order, event }) => {

  try {
    if (isGeneral) {
      const response = [];

      for (var i = 0; i < order.length; ++i) {
        const ref = db.collection("events").doc(event).collection("general-place").doc(order[i].id);
        const document = await ref.get();
        if (document.exists) {
          response.push({ ...document.data() })
        } else {
          return false
        }
      }

      const calculeTotal = (x) => {
        return Object.values(x).reduce(
          (acc, { price }) => acc + parseFloat(price), 0
        )
      }

      if (response.length !== 0) {
        return {
          data: order,
          total: calculeTotal(response)
        }
      } else {
        return false
      }

    } else {
      const response = [];

      for (var i = 0; i < order.length; ++i) {
        const ref = db.collection("events").doc(event).collection("chairs").doc(order[i].id);
        const document = await ref.get();
        if (document.exists) {
          response.push({ ...document.data() })
        } else {
          return false
        }
      }

      const calculeTotal = (x) => {
        return Object.values(x).reduce(
          (acc, { price }) => acc + parseFloat(price), 0
        )
      }

      if (response.length !== 0) {
        return {
          data: order,
          total: calculeTotal(response)
        }
      } else {
        return false
      }
    }
  }
  catch (err) {
    return false
  }
}

const appyDiscountInOrder = async ({ event, order, discountCode }) => {
  let discountProperties = {}
  let discountedAmount = 0

  try {

    const asociatedDataRefCommission = await db
      .collection("events-logitict")
      .doc(event)
      .collection("affiliatePartners")
      .doc(String(discountCode).replace(/ /g, ""))
      .get()
    if (asociatedDataRefCommission.exists) {
      if (asociatedDataRefCommission.data().planProperties.typeOfCommission === "Fixed") {
        discountProperties = {
          affiliateCommission: asociatedDataRefCommission.data().planProperties.affiliateCommission,
          customerDiscount: asociatedDataRefCommission.data().planProperties.customerDiscount,
          typeOfCommission: asociatedDataRefCommission.data().planProperties.typeOfCommission
        }
        //MONTO CON DESCUENTO
        discountedAmount = asociatedDataRefCommission.data().planProperties.customerDiscount * order.length
        return { message: "Descuento aplicado", order: order, discountedAmount: discountedAmount, isSuccess: true, codeUsed: String(discountCode).replace(/ /g, "") }
      }
    } else {
      return { message: "Error en aplicar descuento, codigo no existe", isSuccess: false, err: "Codigo de descuento no existe4" }
    }

  } catch (err) {
    console.log(err)
    return { message: "Error en aplicar descuento", isSuccess: false, err: err }
  }
}

routes.post("/check-order-v2", async (req, res) => {

  const { isGeneral, order, event } = req.body;

  try {
    if (isGeneral) {
      const response = [];

      for (var i = 0; i < order.length; ++i) {
        const ref = db.collection("events").doc(event).collection("general-place").doc(order[i].id);
        const document = await ref.get();
        if (document.exists) {
          response.push({ ...document.data() })
        } else {
          res.send({
            message: "Ocurrio un error en la peticion.",
            isSuccess: false,
          });
        }
      }

      const calculeTotal = (x) => {
        return Object.values(x).reduce(
          (acc, { price }) => acc + parseFloat(price), 0
        )
      }

      if (response.length !== 0) {

        res.send({
          data: order,
          total: calculeTotal(response),
          isSuccess: true,
        });
      } else {
        res.send({
          message: "Ocurrio un error en la peticion.",
          isSuccess: false,
        });
      }

    } else {
      const response = [];
      for (var i = 0; i < order.length; ++i) {
        const ref = db.collection("events").doc(event).collection("chairs").doc(order[i].id);
        const document = await ref.get();
        if (document.exists) {
          response.push({ ...document.data() })
        } else {
          res.send({
            message: "Ocurrio un error en la peticion.",
            isSuccess: false,
          });
        }
      }
      const calculeTotal = (x) => {
        return Object.values(x).reduce(
          (acc, { price }) => acc + parseFloat(price), 0
        )
      }
      if (response.length !== 0) {
        res.send({
          data: order,
          total: calculeTotal(response),
          isSuccess: true,
        });
      } else {
        res.send({
          message: "Ocurrio un error en la peticion.",
          isSuccess: false,
        });
      }
    }
  }
  catch (err) {
    res.send({
      message: "Ocurrio un error en la peticion.",
      isSuccess: false,
    });
  }

});

routes.post("/create-report", async (req, res) => {

  const { data } = req.body;

  try {

    const arrOrder = data.placeRecerve ? data.placeRecerve.length !== 0 ? data.placeRecerve : data.generalPlaceRecerved : data.generalPlaceRecerved
    const isGeneral = data.placeRecerve ? data.placeRecerve.length !== 0 ? false : true : true

    const thereIsAnAffiliateCode = data.associateCode

    const thereIsProtectionInTickets = data.refundProtection

    let discountProperties = {}
    let discountedAmount = data.monto
    if (thereIsAnAffiliateCode) {
      const asociatedDataRefCommission = await db
        .collection("events-logitict")
        .doc(data.event)
        .collection("affiliatePartners")
        .doc(String(data.associateCode).replace(/ /g, ""))
        .get()
      if (asociatedDataRefCommission.data().planProperties.typeOfCommission === "Fixed") {
        discountProperties = {
          affiliateCommission: asociatedDataRefCommission.data().planProperties.affiliateCommission,
          customerDiscount: asociatedDataRefCommission.data().planProperties.customerDiscount,
          typeOfCommission: asociatedDataRefCommission.data().planProperties.typeOfCommission
        }
        //MONTO CON DESCUENTO
        discountedAmount = discountedAmount - (asociatedDataRefCommission.data().planProperties.customerDiscount * arrOrder.length)
      }
    }


    const processOrderCheck = await checkOrder({ order: arrOrder, isGeneral: isGeneral, event: data.event })
    if (!processOrderCheck) { return res.send({ message: "Error en chequeo de orden", isSuccess: false, }) }

    if (!data.associateCode) {
      if (thereIsProtectionInTickets) {
        const refundProtectionAmountInDb = await (await db.collection("utils").doc("refundProtection").get()).data().refundProtection

        if (refundProtectionAmountInDb) {
          const refundProtectionAmountTotal = refundProtectionAmountInDb * arrOrder.length
          if (processOrderCheck.total + (processOrderCheck.total * refundProtectionAmountTotal) !== data.monto) { return res.send({ message: "Monto de peticion no concuerda con la orden", isSuccess: false, }) }
        }

      } else {
        if (processOrderCheck.total !== data.monto) { return res.send({ message: "Monto de peticion no concuerda con la orden", isSuccess: false, }) }
      }
    } else {
      const responseApplyDiscountInOrder = await appyDiscountInOrder({ event: data.event, order: arrOrder, discountCode: data.associateCode })
      if (responseApplyDiscountInOrder) {
        const discountToApply = responseApplyDiscountInOrder.discountedAmount
        const totalPayableWithDiscount = processOrderCheck.total - discountToApply

        if (thereIsProtectionInTickets) {
          const refundProtectionAmountInDb = await (await db.collection("utils").doc("refundProtection").get()).data().refundProtection

          if (refundProtectionAmountInDb) {
            const refundProtectionAmountTotal = refundProtectionAmountInDb * arrOrder.length
            if (totalPayableWithDiscount + (processOrderCheck.total * refundProtectionAmountTotal) !== data.monto) { return res.send({ message: "Monto de peticion no concuerda con la orden", isSuccess: false, }) }
          }

        } else {
          if (totalPayableWithDiscount !== data.monto) {
            res.status(200).json({
              message: "Cantidad no concuerda con la orden.",
              isSuccess: false
            });
          }
        }


      } else {
        res.status(200).json({
          message: "Error en chequeo de orden.",
          isSuccess: false
        });
      }
    }


    const sales = await db.collection("events").doc(data?.event).collection("sales");
    const dataSales = await (await sales.get()).docs.map((el) => el.data());

    const reports = await db.collection("transferPending");
    const dataReports = await (await reports.get()).docs.map((el) => el.data());

    const verifyRef = dataSales.map((el) => {
      if (el.metodoDePago[data.referencia]) {
        if (el.metodoDePago[data.referencia].ref) {
          if (
            data.metodoPago[data.referencia].ref ===
            el.metodoDePago[data.referencia].ref
          ) {
            return true;
          }
        }
      }
    })


    const verifyRefInReports = dataReports.map((el) => {
      if (el.metodoPago[data.referencia]) {
        if (el.metodoPago[data.referencia].ref) {
          if (
            data.metodoPago[data.referencia].ref ===
            el.metodoPago[data.referencia].ref
          ) {
            return true;
          }
        }
      }
    })

    if (verifyRef.some((x) => x === true)) {
      return res.send({ message: "Numero de referencia repetido", isSuccess: false, });
    } else if (verifyRefInReports.some((x) => x === true)) {
      return res.send({ message: "Numero de referencia repetido", isSuccess: false, });
    } else {
      await db.collection("transferPending").add({ ...data, discountProperties: discountProperties, fecha: new Date() });
      return res.send({ message: "Exito reporte añadido", isSuccess: true, amountPayable: processOrderCheck.total });
    }
  } catch (error) {
    console.log(error)
    console.log("ocurrio un error");
    res.send({
      message: "Ocurrio un error en la peticion al servidor",
      isSuccess: false,
    });
  }
});

routes.post("/create-report-with-id", async (req, res) => {
  const { data, id } = req.body;

  try {

    const arrOrder = data.placeRecerve ? data.placeRecerve.length !== 0 ? data.placeRecerve : data.generalPlaceRecerved : data.generalPlaceRecerved
    const isGeneral = data.placeRecerve ? data.placeRecerve.length !== 0 ? false : true : true
    const thereIsProtectionInTickets = data.refundProtection

    const processOrderCheck = await checkOrder({ order: arrOrder, isGeneral: isGeneral, event: data.event })
    if (!processOrderCheck) { return res.send({ message: "Error en su solicitud", isSuccess: false, }) }

    if (!data.associateCode) {
      if (thereIsProtectionInTickets) {
        const refundProtectionAmountInDb = await (await db.collection("utils").doc("refundProtection").get()).data().refundProtection
        if (refundProtectionAmountInDb) {
          const refundProtectionAmountTotal = refundProtectionAmountInDb * arrOrder.length
          if (processOrderCheck.total + (processOrderCheck.total * refundProtectionAmountTotal) !== data.monto) { return res.send({ message: "Monto de peticion no concuerda con la orden", isSuccess: false, }) }
        }
      } else {
        if (processOrderCheck.total !== data.monto) { return res.send({ message: "Monto de peticion no concuerda con la orden", isSuccess: false, }) }
      }
    } else {
      const responseApplyDiscountInOrder = await appyDiscountInOrder({ event: data.event, order: arrOrder, discountCode: data.associateCode })
      if (responseApplyDiscountInOrder) {
        const discountToApply = responseApplyDiscountInOrder.discountedAmount
        const totalPayableWithDiscount = processOrderCheck.total - discountToApply

        if (thereIsProtectionInTickets) {
          const refundProtectionAmountInDb = await (await db.collection("utils").doc("refundProtection").get()).data().refundProtection

          if (refundProtectionAmountInDb) {
            const refundProtectionAmountTotal = refundProtectionAmountInDb * arrOrder.length
            if (totalPayableWithDiscount + (processOrderCheck.total * refundProtectionAmountTotal) !== data.monto) { return res.send({ message: "Monto de peticion no concuerda con la orden", isSuccess: false, }) }
          }

        } else {
          if (totalPayableWithDiscount !== data.monto) {
            res.status(200).json({
              message: "Cantidad no concuerda con la orden.",
              isSuccess: false
            });
          }
        }
      } else {
        res.status(200).json({
          message: "Error en chequeo de orden.",
          isSuccess: false
        });
      }
    }

    await db.collection("transferPending").doc(id).set({ ...data, fecha: new Date() });

    return res.send({ message: "Exito reporte añadido", isSuccess: true });

  } catch (error) {
    console.log(error);
    return res.send({ message: "lo siento pero ocurrio un error", isSuccess: false, });
  }
});

routes.post("/confirm-report", async (req, res) => {
  const { data } = req.body;

  try {
    await db.collection("confirmedPayments").add({ ...data, date: new Date() });
    await db.collection("transferPending").doc(data.id).delete();
  } catch (error) {
    console.log("ocurrio un error al confirmar reporte");
    console.log(error);
    res.send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,
    });
  }
  res.send({ message: "Exito reporte confirmado", isSuccess: true });
});

routes.post("/create-startCheckout-report", async (req, res) => {
  const { data } = req.body;
  try {
    await db
      .collection("reports/startCheckout/data", "startCheckout", "data")
      .add({ ...data, createdAt: new Date() });
  } catch (error) {
    console.log("ocurrio un error");
    console.log(error);
    res.send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,
    });
  }
  res.send({ message: "Exito reporte añadido", isSuccess: true });
});
routes.delete("/delete-report/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection("transferPending").doc(id).delete();
  } catch (err) {
    console.log("ocurrio un error");
    console.log(err);
    res.send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,
    });
  }
  res.send({ message: "Exito reporte eliminado", isSuccess: true });
});
routes.post("/get-report", async (req, res) => {
  const { id } = req.body;
  try {
    const ref = db.collection("transferPending").doc(id);
    const document = await ref.get();
    if (document.empty) {
      res.send({
        message: "Consulta exitosa, Documento no existe",
        isSuccess: false,
        data: false,
      });
    } else {
      res.send({
        message: "Consulta exitosa",
        isSuccess: true,
        data: document.data(),
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,
    });
  }
})
routes.post("/check-reference", async (req, res) => {
  const { ref, paymentMethod } = req.body;

  try {
    const sales = await db.collection("confirmedPayments")

    const dataSales = await (await sales.get()).docs.map((el) => el.data());

    const verifyRef = dataSales.map((el) => {
      if (el.metodoDePago && el.metodoDePago[paymentMethod]) {
        if (el.metodoDePago[paymentMethod].ref) {
          if (el.metodoDePago[paymentMethod].ref === ref) {
            return true
          }
        }
      }
    });

    if (verifyRef.some((x) => x === true)) {
      res.send({
        message: "Referencia repetida",
        isSuccess: false,
      });
    } else {
      res.send({ message: "Referencia valida", isSuccess: true });
    }
  } catch (error) {
    console.log(error)
    res.send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,
    });
  }
});
// REPORTE GENERAL
routes.post("/get-report-sales", async (req, res) => {
  const { user, events, date } = req.body;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const clock = date ? new Date(date) : new Date();
  const month = clock.getMonth();
  const day = clock.getDate();

  const formatReportDate = `${months[month]} ${day}`;

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  try {
    const sales = [];
    for (var i = 0; i < events.length; ++i) {
      await timeout(100);
      const eventId = events[i];
      const ref = db.collection("events").doc(eventId).collection("sales");
      const snapshot = await ref
        .where("lugarDeVenta", "==", user)
        .where("formatFacturationDate", "==", formatReportDate)
        .get();
      if (snapshot.empty) {
        console.log("No matching documents.");
      }
      snapshot.forEach((doc) => {
        const object = { id: doc.id, ...doc.data() };
        sales.push(object);
      });
    }

    if (sales.length !== 0) {
      res.send({
        message: "Consulta exitosa",
        isSuccess: true,
        data: sales,
      });
    } else {
      res.send({
        message: "Consulta exitosa, Cero registros",
        isSuccess: true,
        data: sales,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,
    });
  }
});

//OBTENER REPORTE DE LUGARES DISPONIBLES

routes.get('/zones-availables/:eventId', getAvailableZonesTicket)

//VERIFICAR BOLETOS Y MONTO
routes.post("/check-order", async (req, res) => {
  const { event, array } = req.body;
  try {
    const order = [];
    for (var i = 0; i < array.length; ++i) {
      const ref = db.collection("events").doc(event).collection("chairs").doc(array[i].idPlace);
      const document = await ref.get();
      if (document.exists) {
        order.push({ ...document.data() })
      } else {
        console.log("No matching documents.");
      }
    }
    const calculeTotal = (x) => {
      return Object.values(x).reduce(
        (acc, { price }) => acc + parseFloat(price), 0
      )
    }
    if (order.length !== 0) {
      res.send({
        message: "Consulta exitosa",
        isSuccess: true,
        data: order,
        total: calculeTotal(order)
      });
    } else {
      res.send({
        message: "Consulta exitosa, Cero registros",
        isSuccess: true,
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,
    });
  }
});

routes.post("/solve", async (req, res) => {

  console.log("SOLVE")
  try {

    const configResult = await dbGB
      .collection("events")
      .doc("JustinQuilesLaUltimaPromesaTour")
      .collection("sales")
    const data = await (await configResult.get()).docs.map((el) => el.data());

    const methodsInDollars = [
      "binance",
      "zelle",
      "zinli",
      "efectivo",
      "reserve",
      "tarjetaDeCredito"
    ]
    const ticketsInBs = []
    const ticketsInDollars = []
    const ticketsInMultipayments = []
    const prices = []
    const tickets = []
    const salesByPrice = {}
    const zones = []

    await data.map(async (el) => {
      if (el.referenciaDePago === "multipagos") {
        el.boletos.forEach(y => {
          if (!prices.some(z => z === y.precio)) prices.push(y.precio)
          if (!zones.some(z => z === y.zona)) zones.push(y.zona)
          ticketsInMultipayments.push(y)
          tickets.push(y)
        })
      } else {
        if (methodsInDollars.some(x => x === el.referenciaDePago)) {
          el.boletos.forEach(y => {
            if (!prices.some(z => z === y.precio)) prices.push(y.precio)
            if (!zones.some(z => z === y.zona)) zones.push(y.zona)
            ticketsInDollars.push(y)
            tickets.push(y)
          })
        } else {
          el.boletos.forEach(y => {
            if (!zones.some(z => z === y.zona)) zones.push(y.zona)
            if (!prices.some(z => z === y.precio)) prices.push(y.precio)
            ticketsInBs.push(y)
            tickets.push(y)
          })
        }
      }
    })


    zones.forEach(w => {
      const ticketsInZone = tickets.filter(y => y.zona === w)
      prices.forEach(x => {
        if (!salesByPrice[`${w + "-" + x}`]) {
          if (ticketsInZone.filter(y => y.precio === x).length !== 0) salesByPrice[`${w + "-" + x}`] = ticketsInZone.filter(y => y.precio === x).length

        }
      })
    })



    console.log(salesByPrice)

    res.send({
      isSuccess: true,
      message: "exito peticion realizada",
    })

  } catch (err) {
    console.log(err)
  }
});



// export default createAsociate;

export default routes;
