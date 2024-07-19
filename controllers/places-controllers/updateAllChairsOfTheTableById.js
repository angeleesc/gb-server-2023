import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../firebase/firebase.cjs";

const updateAllChairsOfTheTableById = async (req, res) => {
  // este end point actualiza los datos  de todas las sillas ubicada en una meza

  console.log(req.body);
  const { eventId, mesa, data, chairCollection } = req.body;

  const { user } = req.headers;

  if (!user) {
    res.send({
      message: "lo siento pero debes tene el idi del usuario en en header",
      isSucces: false,
    });
    return;
  }

  console.log(data);

  const charisQeury = db
    .collection("events")
    .doc(eventId)
    .collection(chairCollection || "chairs")
    .where("mesa", "==", mesa);

  const userRef = db.collection("users-dashboard").doc(user);
  const result = await userRef.get();

  let userData;

  if (result.exists) {
    userData = result.data();
  } else {
    res.send({
      isSucces: false,
      message: "lo siento pero el usuario no exite",
    });
  }

  try {
    let chairsData;

    await db.runTransaction(async (t) => {
      console.log("iniciando transacion");

      const chairsSnap = await t.get(charisQeury);

      if (!chairsSnap.empty) {
        // let data to send
        for (let chairSnap of chairsSnap.docs) {
          console.table(chairSnap.data());

          const updateDataRef = db
            .collection("events")
            .doc(eventId)
            .collection(chairCollection || "chairs")
            .doc(chairSnap.id);

          const chaisrCollectionRef = db
            .collection("events")
            .doc(eventId)
            .collection("chairs-controls")
            .doc(chairSnap.id);

          const controlChairData = { ...data };

          if ( data.estado && data.estado === "ok") {
            controlChairData.reason = FieldValue.delete();
            controlChairData.updatedBy = FieldValue.delete();
          } else {
            controlChairData.reason = "su";
            controlChairData.updatedBy = userData.email; 
          }

          t.update(chaisrCollectionRef, controlChairData);
          t.update(updateDataRef, data);
        }
      } else {
        console.log("no hay nada");
      }
    });
  } catch (error) {
    console.log("ocurrio un error");
    console.error(error);
  }

  res.send({
    message: "exito mesa actualizada",
  });
};

export default updateAllChairsOfTheTableById;
