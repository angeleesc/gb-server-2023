import { db } from "../../firebase/firebase.cjs";

const placeRowGenerator = async (req, res) => {
  const { zona, zonaName, rows, chairsPerRows, taxtData, eventId } = req.body;

  console.log(req.body);

  console.log("prosesando");

  const chaisrBatch = db.batch();
  const chaisrControlBatch = db.batch();

  for (let row of rows) {
    console.log("row");
    for (let i = 1; i <= chairsPerRows; i++) {
      const chairId = `${zona}-${row}${i}`;
      //   console.log(chairId);
      const chairName = `${zonaName} silla ${row}${i}`;
      console.log(chairName);

      const chairData = {
        ...taxtData,
        zona,
        chairName,
        estado: "ok",
        fila: row,
        posicion: i,
        idPlace: chairId,
      };

      const chairRef = db
        .collection("events")
        .doc(eventId)
        .collection("chairs")
        .doc(chairId);

      chaisrBatch.set(chairRef, chairData);
    }
  }

  for (let row of rows) {
    for (let i = 1; i <= chairsPerRows; i++) {
      const chairId = `${zona}-${row}${i}`;
      //   console.log(chairId);
      const chairName = `${zonaName} silla ${row}${i}`;
      console.log(chairName);

      const chairData = {
        ...taxtData,
        zona,
        chairName,
        estado: "ok",
        fila: row,
        posicion: i,
        idPlace: chairId,
      };

      const chairRef = db
        .collection("events")
        .doc(eventId)
        .collection("chairs-controls")
        .doc(chairId);

      chaisrControlBatch.set(chairRef, chairData);
    }
  }

  await chaisrBatch.commit();
  await chaisrControlBatch.commit();
  console.log("escritura de lote finalizada");

  res.send({ message: "exito-nuevos puesto añadidos" });
};

export default placeRowGenerator;
