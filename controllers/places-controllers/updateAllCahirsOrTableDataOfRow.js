import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../firebase/firebase.cjs";

const updateAllDataOfCharisByRow = async (req, res) => {
  const { fila, eventId, data, zona } = req.body;

  console.log(fila, eventId, data, zona)

  const { tableData, chairData } = data;

  const { user } = req.headers;

  if (!user) {
    res.send({
      message: "lo siento pero debes tene el idi del usuario en en header",
      isSucces: false,
    });
    return;
  }

  const userRef = db.collection("users-dashboard").doc(user);
  const resultUser = await userRef.get();

  let userData;

  if (resultUser.exists) {
    userData = resultUser.data();
  } else {
    res.send({
      isSucces: false,
      message: "lo siento pero el usuario no exite",
    });
    return;
  }

  const tableQuery = db
    .collection("events")
    .doc(eventId)
    .collection("tables")
    .where("fila", "==", fila)
    .where("zona", "==", zona);

  const result = await tableQuery.get();

  if (!result.empty) {
    for (let data of result.docs) {
      try {
        await db.runTransaction(async (t) => {
          const localChairRef = db
            .collection("events")
            .doc(eventId)
            .collection("chairs")
            .where("mesa", "==", data.id);
          const localChairResult = await t.get(localChairRef);

          console.log("obteniendo sillas de cada mesa");

          if (!localChairResult.empty) {
            for (let localChair of localChairResult.docs) {
              console.log(localChair.data());

              const localChairToUpdateRef = db
                .collection("events")
                .doc(eventId)
                .collection("chairs")
                .doc(localChair.id);

              const chairControlRef = db
                .collection("events")
                .doc(eventId)
                .collection("chairs-controls")
                .doc(localChair.id);

              const chairControldata = {
                ...chairData,
              };

              if (chairData.estado && chairData.estado === "ok") {
                chairControldata.reason = FieldValue.delete();
                chairControldata.updatedBy = FieldValue.delete();
              } else {
                chairControldata.reason = "su";
                chairControldata.updatedBy = userData.email;
              }

              t.update(localChairToUpdateRef, chairData);
              t.update(chairControlRef, chairControldata);
            }
          }
        });
      } catch (error) {
        console.log("ocurrio un error");
        console.log(error)
      }
    }
  }

  res.send({
    message: "sexito toda la fila actulizada",
  });
};

export default updateAllDataOfCharisByRow;
