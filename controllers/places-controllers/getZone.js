import { db } from "../../firebase/firebase.cjs";

const getZone = async (req, res) => {
    const { eventId, place, charisId } = req.query;
    const placeQuery = db.collection("events").doc(eventId).collection(place);
    const placesResult = await placeQuery.get();
  
    if (placesResult) {
      // const placesData = [];
      const placesOrder = {};
  
      for (let place of placesResult.docs) {
        const chairQuery = db
          .collection("events")
          .doc(eventId)
          .collection(charisId)
          .where("mesa", "==", place.id);
  
        // const pos
        const chairsResult = await chairQuery.get();
  
        const chairs = [];
  
        if (!chairsResult.empty) {
          chairsResult.forEach((chair) => {
            chairs.push({
              idPlace: chair.data().idPlace,
              id: chair.id,
              posicion: chair.data().posicion,
              positions: chair.data().positions,
              estado: chair.data().estado,
            });
          });
        }
  
        if (!placesOrder[place.data().zona]) {
          placesOrder[place.data().zona] = {};
          placesOrder[place.data().zona][place.data().fila] = [];
          placesOrder[place.data().zona][place.data().fila].push({
            idMesa: place.data().mesa,
            chairs,
            posicionMesa: place.data().positions,
          });
        } else {
          if (!placesOrder[place.data().zona][place.data().fila]) {
            placesOrder[place.data().zona][place.data().fila] = [];
            placesOrder[place.data().zona][place.data().fila].push({
              idMesa: place.data().mesa,
              chairs,
              posicionMesa: place.data().positions,
            });
          } else {
            placesOrder[place.data().zona][place.data().fila].push({
              idMesa: place.data().mesa,
              chairs,
              posicionMesa: place.data().positions,
            });
          }
        }
      }
      res.send({ message: "exitoXD", placesOrder });
      return;
    }
    res.send({ message: "no hay datos" });
  }

  export default getZone