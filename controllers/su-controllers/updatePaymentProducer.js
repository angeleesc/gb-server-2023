import { dbGB } from "../../firebase/firebase.cjs";

const updatePaymentProducer = async (req, res) => {
  const { eventId, payId } = req.params;
  const data = req.body;

  try {
    await dbGB.runTransaction(async (t) => {
      const serviceRef = dbGB.collection("events").doc(eventId).collection("payments-producer").doc(payId);

      const result = await t.get(serviceRef);

      if (result.exists) {
        //        const dataToUpdate = { ...data };
        const { ...dataToUpdate } = data 
        const paymentDate =dataToUpdate.paymentDate===null?false: new Date(dataToUpdate.paymentDate)

        if (paymentDate!==false) {
          t.update(serviceRef, {
            ...dataToUpdate,
            lastUpdateDate: new Date(),
            paymentDate: paymentDate
          });
        } else {
          console.log(dataToUpdate)
          t.update(serviceRef, {
            ...dataToUpdate,
            lastUpdateDate: new Date(),
            paymentDate: result.data().paymentDate

          });
        }

      } else {
        res.send({

          message: "No existe el Pago",
          isSuccess: false,
        })


      }
    });
  } catch (error) {
    console.log(error)
    res.send({
      message: "ocurrio un error",
      isSuccess: false,
      error,
    });

    return;
  }
  res.send({
    message: "Exito, pago actualizado",
    isSuccess: true,
  });
};

export default updatePaymentProducer;
