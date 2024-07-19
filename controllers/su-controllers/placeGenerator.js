import { db } from "../../firebase/firebase.cjs";

const placeGenerator = async (req, res) => {
  const { tables, eventId, price, zona, taxtData } = req.body;

  let defaultPosition = 1;

  for (let table of tables) {
    const {
      mesa,
      mesaName,
      fila,
      tablePrice,
      chairsC,
      Disponible,
      chairs,
      positions,
      tableTaxt,
    } = table;

    const tablesBath = db.batch();
    const tableRef = db
      .collection("events")
      .doc(eventId)
      .collection("tables")
      .doc(mesa);

    const tableData = {
      mesa,
      fila,
      zona,
      tablePrice: tablePrice || tablePrice === 0 ? tablePrice : price * chairsC,
      chairs: chairsC,
      Disponible,
      positions: positions ? positions : defaultPosition,
    };

    // gregamos el taxt que se evalua

    if (
      tableTaxt &&
      typeof tableTaxt === "object" &&
      Object.keys(tableTaxt).length > 0
    ) {
      for (let tableTaxtKey in tableTaxt) {
        console.log(tableTaxtKey);
        tableData[tableTaxtKey] = tableTaxt[tableTaxtKey];
      }
    } else if (
      taxtData &&
      typeof taxtData === "object" &&
      Object.keys(taxtData).length > 0
    ) {
      for (let taxtKey in taxtData) {
        console.log(taxtKey);
        if (taxtKey === "price") {
          tableData.tablePrice = Number(
            (taxtData[taxtKey] * chairsC).toFixed(2)
          );
        } else {
          tableData[taxtKey] = Number((taxtData[taxtKey] * chairsC).toFixed(2));
        }
      }
    }

    if (mesaName) tableData.mesaName = mesaName;
    tablesBath.set(tableRef, tableData);

    // agregamos las sillas asociada al puesto

    let chairPosition = 0;

    for (let chair of chairs) {
      const { idPlace, chairPrice, chairTaxt, posicion, ...restChair } = chair;
      chairPosition++;

      const chairRef = db
        .collection("events")
        .doc(eventId)
        .collection("chairs")
        .doc(idPlace);
      const chairControlRef = db
        .collection("events")
        .doc(eventId)
        .collection("chairs-controls")
        .doc(idPlace);

      const chairData = {
        ...restChair,
        idPlace,
        tablePosition: positions,
        zona,
        fila,
        mesa,
        posicion: posicion ? posicion : chairPosition,
        price: chairPrice ? chairPrice : price,
      };

      if (
        chairTaxt &&
        typeof chairTaxt === "object" &&
        Object.keys(chairTaxt).length > 0
      ) {
        console.log(chairTaxt);
        for (let chairTaxtKey in chairTaxt) {
          chairData[chairTaxtKey] = chairTaxt[chairTaxtKey];
        }
      } else if (
        taxtData &&
        typeof taxtData === "object" &&
        Object.keys(taxtData).length > 0
      ) {
        for (let taxtKey in taxtData) {
          chairData[taxtKey] = taxtData[taxtKey];
        }
      }

      tablesBath.set(chairRef, chairData);
      tablesBath.set(chairControlRef, chairData);
    }

    await tablesBath.commit();
    defaultPosition += 1;
  }

  console.log("opracion exitosa XD");

  res.send({
    message: "exito XD",
  });
};

export default placeGenerator;
