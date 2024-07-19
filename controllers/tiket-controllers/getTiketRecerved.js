import { add } from "date-fns";
import { v1 } from "uuid";
import { dbGB } from "../../firebase/firebase.cjs";

const getTiketRcerved = async (req, res) => {
  const { placeRecerve, userData } = req.body;
  let isSomeRecerved = false;
  const reservatioId = v1();
  const recervatioTime = new Date();
  
  const eventConfigRef = dbGB.collection('events-logitict').doc(req.body.eventId)
  const eventConfigResult = await eventConfigRef.get()
  // const {maxRecervationTime}  = eventConfigResult.data()

  let maxRecervationTime = 20

  if(eventConfigResult.exists){
    // console.log(eventConfigResult.data())
    maxRecervationTime = eventConfigResult.data().maxRecervationTime
  }

  console.log('tempo maximo de recervacion', maxRecervationTime)

  console.log('tiempo maximo munutos', maxRecervationTime)

  const expirationTime = add(new Date(), { minutes: maxRecervationTime });

  if (!(placeRecerve.length > 0)) {
    res.send({
      message: "lo siento pero place es requerido",
      isSuccess: false,
    });
  }



  const refColection = dbGB
    .collection("events")
    .doc(req.body.eventId)
    .collection("chairs");

  const reservationRef = dbGB
    .collection("events")
    .doc(req.body.eventId)
    .collection("recervations")
    .doc(reservatioId);

  const chairsControlCollection = dbGB
    .collection("events")
    .doc(req.body.eventId)
    .collection("chairs-controls");

  try {
    await dbGB.runTransaction(async (t) => {
      const placesToRecerve = [];

      for (let placeForRecerve of placeRecerve) {
        const placeRef = refColection.doc(placeForRecerve.id);
        const placeControlRef = chairsControlCollection.doc(placeForRecerve.id);

        const placeResult = await t.get(placeRef);

        if (!placeResult.exists) {
          throw new Error(
            "lo siento pero este lugar no existe en enste evento"
          );
        }
        const currentPlaceData = placeResult.data();
        console.log("verificando");
        console.log("curent place ", currentPlaceData);
        if (
          currentPlaceData.estado === "recerved" ||
          currentPlaceData.estado === "block"
        ) {
          console.log("esta reservado");
          isSomeRecerved = true;
          break;
        } else {
          const dataToUpdate = {
            estado: "recerved",
            expirationTime,
            reservatioId,
          };

          const dataToUpdateControl = {
            ...dataToUpdate,
            reason: "client-loged-recerved",
          };

          if (userData) dataToUpdateControl.userData = userData;

          const placeManipulateData = {
            placeRef,
            dataToUpdate: dataToUpdate,
          };

          if (userData) {
            placeManipulateData.dataToUpdateControl = dataToUpdateControl;
            placeManipulateData.placeControlRef = placeControlRef;
          }

          placesToRecerve.push(placeManipulateData);
        }
      }

      if (isSomeRecerved)
        throw new Error("lo siento pero este puesto ya esta ocupado");
      console.log(placesToRecerve);

      for (let placeToRecerce of placesToRecerve) {
        const { dataToUpdate, placeRef, dataToUpdateControl, placeControlRef } =
          placeToRecerce;
        t.update(placeRef, dataToUpdate);

        if (dataToUpdateControl && typeof dataToUpdateControl === "object") {
          t.update(placeControlRef, dataToUpdateControl);
        }
      }

      const recervationData = {
        recervationTime: recervatioTime,
        reservationId: reservatioId,
        expirationTime,
        placeRecerve,
      };

      if (userData && typeof userData === "object")
        recervationData.userData = userData;

      t.set(reservationRef, recervationData);
    });
  } catch (error) {
    console.log(error)
    res.send({
      message: "lo sieento pero ocurrio un error",
      isSuccess: false,
      error,
    });

    return;
  }

  console.log("is some recerverd", isSomeRecerved);

  if (isSomeRecerved) {
    res.send({
      isSuccess: false,
      message: "lo siento pero este puesto esta ocupado",
    });
    return;
  }

  const dataToRecerve = {
    message: "recervado",
    expirationTime,
    reservatioId,
    placeRecerve,
  };

  if (userData) {
    dataToRecerve.userData = userData;
  }

  console.log(dataToRecerve);

  res.send(dataToRecerve);
};

export default getTiketRcerved;
