import { dbGB } from "../../firebase/firebase.cjs";

const createRefundSale = async (req, res) => {
  const {salesData,refundData} = req.body;
  const { eventId } = req.params;

  try {
      await dbGB.collection("events").doc(eventId).collection("refunds").add({salesData,...refundData,dateRefund:new Date()});

    

    

    res.send({
      isSuccess: true,
      message: "Movimiento Creado",
    });
  } catch (err) {
    console.log(err)
    res.send({
      isSuccess: false,
      message: "Error en peticion",
    });
  }
};
export default createRefundSale;
