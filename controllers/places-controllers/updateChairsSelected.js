import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../firebase/firebase.cjs";

const updateAllChairsSelected = async (req, res) => {
  const { eventId, chairCollection, idPlaces, data } = req.body;
  const { user } = req.headers;

  if (!user) {
    res.send({
      message: "lo siento pero debes tene el id del usuario en en header",
      isSucces: false,
    });
    return;
  }

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
    return;
  }

  const chairDir = db
    .collection("events")
    .doc(eventId)
    .collection(chairCollection || "chairs");

  const chairControlDir = db
    .collection("events")
    .doc(eventId)
    .collection("chairs-controls");

  try {
    await db.runTransaction(async (t) => {
      const chairsFroEdit = [];


      for (let idPlace of idPlaces) {
        const chairRef = chairDir.doc(idPlace);
        const chairSnap = await t.get(chairRef);

        if (chairSnap) {
          console.log(chairSnap.data());
          chairsFroEdit.push({ ...chairSnap.data(), id: chairSnap.id });
        }
      }

      for (let chairForEdit of chairsFroEdit) {
        const chairControlRef = chairControlDir.doc(chairForEdit.id);

        const chairControldata = {
          ...data,
        };

        if (data.estado && data.estado === "ok") {
          chairControldata.reason = FieldValue.delete();
          chairControldata.updatedBy = FieldValue.delete();
          chairControldata.comentForPlace = FieldValue.delete();
          chairControldata.lockAuthorization = FieldValue.delete();
        } else {
          chairControldata.reason = "su";
          chairControldata.lockAuthorization = userData.email;
          chairControldata.updatedBy = userData.email;

          if (userData.comentForPlace) {
            chairControldata.comentForPlace = userData.comentForPlace
          }

        }


        const chairRef = chairDir.doc(chairForEdit.id);
        t.update(chairRef, data);
        t.update(chairControlRef, chairControldata);
      }
    });
  } catch (error) {
    console.log("ocurrio un error");
    console.log(error);
  }






  // actualizamos el estado de la mesa

  console.log(req.body);
  res.send({ message: "exito todas las sillas editada" });
};

export default updateAllChairsSelected;
