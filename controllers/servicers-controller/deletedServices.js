import { db } from "../../firebase/firebase.cjs";

const deleteServices =  async (req, res) => {
    const { servicesId, eventId } = req.params;
  
    const servicesTodelete = db
      .collection("events-logitict")
      .doc(eventId)
      .collection("provider-services")
      .doc(servicesId);
  
      await servicesTodelete.delete();
  
      res.send({message:'exito servicio eliminado'})
  
  }

  export default deleteServices