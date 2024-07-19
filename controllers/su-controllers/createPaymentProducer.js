import { db } from "../../firebase/firebase.cjs";

const createPaymentProducer = async (req, res) => {

  const { ...data } = req.body;
  const { eventId } = req.params
  try {
    // await db.runTransaction(async (t) => {
    //   const refdb = db.collection("events").doc(eventId).collection("payments-producer"); 
    //   const { ...newData} = data
    //   t.set(refdb,{fechaRecibo:new Date(),lastUpdateDate:new Date(),...newData});
    // });


    await db.collection("events").doc(eventId).collection("payments-producer").add({
      ...data,
      fechaRecibo: new Date(),
      lastUpdateDate: new Date(),
      paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
    });

  } catch (err) {
    console.log("ocurrio un error");
    console.log(err);
    res.status(500).send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,

    });
  }
  res.status(200).send({ message: "Exito, Pago añadido", isSuccess: true });

};
export default createPaymentProducer;
