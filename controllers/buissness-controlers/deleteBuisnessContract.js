import { dbGB } from "../../firebase/firebase.cjs";

 
 const deleteBouisnessContract =  async(req, res) => {
    const { Rif, eventId, type } = req.params;
  
    const buisnessToDeleteRef = dbGB
      .collection("events-logitict")
      .doc(eventId)
      .collection(type)
      .doc(Rif);
      try {
        await buisnessToDeleteRef.delete();
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

  export default deleteBouisnessContract