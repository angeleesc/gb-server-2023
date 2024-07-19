import { FieldValue } from "firebase-admin/firestore";
import { dbGB } from "../../firebase/firebase.cjs";

const cancelGeneralRecerve = async (req, res) => {
  console.log(req.body);

  const {
    eventId,
    generalPlaceRecerved,
    generalRecervationId: reservatioId,
  } = req.body;
  console.log(req.body);

  const recervationsRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("recervations")
    .doc(reservatioId);

  const colectionREf = dbGB
    .collection("events")
    .doc(eventId)
    .collection("general-place");
  console.log("recervatio id", reservatioId);

  try {
    await dbGB.runTransaction(async (t) => {
      for (let placeToCancel of generalPlaceRecerved) {
        const placeTocalcelRef = colectionREf.doc(placeToCancel.id);
        const dataToUpdate = {
          price: placeToCancel.price,
          expirationTime: FieldValue.delete(),
          reservatioId: FieldValue.delete(),
          estado: "ok",
        };
        t.update(placeTocalcelRef, dataToUpdate);
      }

      t.delete(recervationsRef);
    });
  } catch (error) {
    res.send({
      message: "lo siento ocurrio un error",
      isSuccess: false,
      error,
    });
  }

  res.send({ message: "cancelado XD" });
};

export default cancelGeneralRecerve;
