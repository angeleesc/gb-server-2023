import { dbGB } from "../../firebase/firebase.cjs";


const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  const transferPending = dbGB
    .collection("events")
    .doc(eventId)

  // a pesar de que se elimine el documento del evento raiz todavia esta presente los lugaress y los ducmento asociado asi como las trasaciones las trasaciones se puede quedar pero lo lugares no XD
  


  try {

    await transferPending.delete();

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

export default deleteEvent