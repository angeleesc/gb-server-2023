import { add } from "date-fns";
import { Router } from "express";
import { db } from "../firebase/firebase.cjs";
import { v1 as uuidv1 } from "uuid";

const routes = Router();

routes.post("/", async (req, res) => {
  // console.log(req.body);

  if (!req.body.eventId) {
    res.send({
      message: "lo siento pero evento es requerido",
      isRecerve: false,
    });
  }
  if (!req.body.placeId) {
    res.send({
      message: "lo siento pero evento es requerido",
      isRecerve: false,
    });
  }
  if (!req.body.rowPlaceRef) {
    res.send({
      message: "lo siento pero evento es requerido",
      isRecerve: false,
    });
  }

  const { eventId, placeId, rowPlaceRef, rowPlace } = req.body;
  let validPlaceData;

  

  const placeDataRef = db
    .collection("events")
    .doc(eventId)
    .collection("places")
    .doc(placeId)
    .collection("chairs")
    .doc("chairs");

  const placeData = await placeDataRef.get();

  // primero separamos los datos que pertenece al usuario

  // console.log(placeData.data()[rowPlaceRef]);
  console.log("----datos porveniente de la base de datos-----");
  // console.table(placeData.data()[rowPlaceRef].places);
  const currenStatusPlaces = placeData.data()[rowPlaceRef].places;
  console.table(currenStatusPlaces);
  console.log("----datos proveniente del usuario-----");
  console.table(rowPlace);

  const placeRecerveWOutId = rowPlace.filter(
    (place) => place.estado === "recerved" && !place.recervedId
  );

  // actualizamos los datos de la columna recorriendo el ultimo dato de place a actualizar
  console.log(placeRecerveWOutId);

  const expirationTime = add(new Date(), { minutes: 11 });
  const recervedId = uuidv1();

  const placeUpdate = currenStatusPlaces.map((cPlace) => {
    // console.log("puestao a evaluar"), console.table(cPlace);
    // verificamos si el id de la silla coincide con el de usuarion

    let placeUpdate = cPlace;

    for (let placeForRecerved of placeRecerveWOutId) {
      console.log(
        "evaluar: ",
        cPlace.place,
        "solicitado: ",
        placeForRecerved.place
      );

      // si es uno de los puesto que quiere el usuario

      if (cPlace.place === placeForRecerved.place) {
        console.log("--- este lugar lo quiere el usuario ----");
        //si tiene un id no se puede hace nada

        placeUpdate = {
          place: cPlace.place,
          estado: "recerved",
          expirationTime,
          recervedId,
        };

        if (!cPlace.id) {
      
           

        } else {



        }
      }
    }
  });

  res.send({
    message: "angel estuvo aqui",
  });
});

// extramos el datos del usuario a recervar se sabe porque su estado dice recervado pero no tiene un id

routes.post("/recet-recervation", async (req, res) => {
  console.log("resetado");

  res.send({
    message: "resetead XD",
  });
});

export default routes;
