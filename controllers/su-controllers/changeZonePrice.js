import { db } from "../../firebase/firebase.cjs";

 const ChangeZonePrice =  async (req, res) => {
    const { eventId,value,type } = req.body;
    const { servicesId } = req.params;
  
    
  
    try {
      await db.runTransaction(async (t) => {
        const serviceRef = db
          .collection("events")
          .doc(eventId)
          .collection("provider-services")
          .doc(servicesId);
  
        const result = await t.get(serviceRef);
  
        if (result.exists) {
          const dataToUpdate =''

          t.update(serviceRef, dataToUpdate);
        } else {
          console.log("no hay nada");
        }
      });
    } catch (error) {
      console.log(error);
    }
  
    res.send({
      message: "exito servicio actualizado",
      isSuccess: true,
    });
  }

  export default ChangeZonePrice