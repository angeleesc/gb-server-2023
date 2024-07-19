import { dbGB } from "../../firebase/firebase.cjs";

 
 const deleteZoneGeneral =  async(req, res) => {
    const { idZone,eventId } = req.params;
  
    const generalPlace = dbGB.collection("events").doc(eventId).collection('general-place').doc(idZone)
  
      try {
        
        await generalPlace.delete();
  
        res.send({
          message: "exito eliminado",
          isSuccess: true,
        });
  
        return
      } catch (error) {
        
        res.send({
          message: "ocurrio un error",
          isSuccess: false,
          error
        });
  
        return
      }
  
  }

  export default deleteZoneGeneral