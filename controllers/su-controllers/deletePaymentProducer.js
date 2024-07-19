import { dbGB } from "../../firebase/firebase.cjs";

 
 const deletePaymentProducer =  async(req, res) => {
    const { eventId,payId } = req.params;
  
    const transferPending =  dbGB.collection("events").doc(eventId).collection("payments-producer").doc(payId);

      try {
        
        await transferPending.delete();
  
        res.send({
          message: "Exito, eliminado",
          isSuccess: true,
        });
  
        return
      } catch (error) {
        
        res.send({
          message: "Ocurrio un error",
          isSuccess: false,
          error
        });
  
        return
      }
  
  }

  export default deletePaymentProducer