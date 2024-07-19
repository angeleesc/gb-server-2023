import { db } from "../../firebase/firebase.cjs";

 const updateService =  async (req, res) => {
    const { eventId, contributed, sub, total, ...data } = req.body;
    const { servicesId } = req.params;
  
    console.log(servicesId);
  
    try {
      await db.runTransaction(async (t) => {
        const serviceRef = db
          .collection("events-logitict")
          .doc(eventId)
          .collection("provider-services")
          .doc(servicesId);
  
        const result = await t.get(serviceRef);
  
        if (result.exists) {
          const dataToUpdate = { ...data };
  
          if (contributed && sub) {
            dataToUpdate.contributed = result.data().contributed
              ? Number((result.data().contributed - contributed).toFixed(2))
              : contributed;
            dataToUpdate.remaining = Number(
              (result.data().total + contributed).toFixed(2)
            );
          } else if (contributed) {
            dataToUpdate.contributed = result.data().contributed
              ? Number((contributed + result.data().contributed).toFixed(2))
              : contributed;
            dataToUpdate.remaining = Number(
              (result.data().remaining - contributed).toFixed(2)
            );
          }
  
          if (total && contributed) {
            dataToUpdate.remaining = total - dataToUpdate.contributed;
            dataToUpdate.total = total;
          } else if (total) {
            dataToUpdate.remaining = total - result.data().contributed;
            dataToUpdate.total = total;
          }

  
          if (dataToUpdate.remaining === 0 || dataToUpdate.remaining <= 0) {
            console.log("remaining ", dataToUpdate.remaining);
            dataToUpdate.totalCancel = true;
            dataToUpdate.check = true;
          }
  
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

  export default updateService