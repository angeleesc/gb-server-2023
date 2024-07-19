import { FieldValue } from "firebase-admin/firestore";
import { dbGB } from "../../firebase/firebase.cjs";

const cancelRecerved = async (req, res) => {
  const { placeRecerve, eventId, reservatioId } = req.body;

  const refColection = dbGB
    .collection("events")
    .doc(eventId)
    .collection("chairs");

  const chairControlRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("chairs-controls");

  const refRecervationDoc = dbGB
    .collection("events")
    .doc(eventId)
    .collection("recervations")
    .doc(reservatioId);
  const recervationResult = await refRecervationDoc.get();

  let userData = null;

  if (recervationResult.exists) {
    console.log(recervationResult.data());
    userData = recervationResult.data().userData;
  }


  for (let placeForRecet of placeRecerve) {
    const placeControlRef = chairControlRef.doc(placeForRecet.id);
    const placeForRecerveRef = refColection.doc(placeForRecet.id);
    const placeForeReceData = await placeForRecerveRef.get();

    if (userData) {
      const controlDataToRecet = {
        reservatioId: FieldValue.delete(),
        expirationTime: FieldValue.delete(),
        estado: "ok",
        reason: FieldValue.delete(),
        userData: FieldValue.delete(),
      };

      await placeControlRef.update(controlDataToRecet);
    }

    if (placeForeReceData.exists) {
      const currentPlaceRecevedData = placeForeReceData.data();
      if (currentPlaceRecevedData.reservatioId === reservatioId) {
        const dataForRecet = {
          ...currentPlaceRecevedData,
          reservatioId: FieldValue.delete(),
          expirationTime: FieldValue.delete(),
          estado: "ok",
        };
        await placeForRecerveRef.update(dataForRecet);
      } else {
        res.send({
          message:
            "lo siento pero el usuario tiene derecho para apartar el puesto",
          isSuccess: false,
        });
        break;
      }
    }
  }

  console.log(reservatioId);

  await refRecervationDoc.delete();

  res.send({ message: "receteado", isSuccess: true });
};

export default cancelRecerved;
