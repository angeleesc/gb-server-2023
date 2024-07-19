import { add } from "date-fns";
import { v1 } from "uuid";
import { dbGB } from "../../firebase/firebase.cjs";

const recervedGeneralPlace = async (req, res) => {
  const { cantidad, eventId, zona, userData } = req.body;
  const eventRef = dbGB.collection("events").doc(eventId);

  
  const cortesiaRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("courtesy-tickets")
    .where("zona", "==", zona);

  const generalRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("general-place")
    .where("zona", "==", zona);

  const salesRef = dbGB.collection("events").doc(eventId).collection("sales");

  
  const dataEvent =  (await eventRef.get()).data();
  const cortesias =  await cortesiaRef.get();
  const totalCortesias = cortesias.docs.map((el) => el.data());


  // se obtiene las ventas 

const fetchSales = await salesRef.get();
  const salesData = fetchSales.docs.map((el) => el.data());
  const salesTotal = salesData
    ?.filter((el) => el?.boletos?.[0]?.zona === zona)
    ?.map((el) => el.boletos.length)
    ?.reduce((prev, curr) => prev + curr, 0);

const general = await generalRef.get();
const generalData = general.docs.map((el) => el.data());
const totalGeneral = generalData.filter(x=>x.estado ==='reserved')?.length

  const zoneAforo = dataEvent?.zones?.find((el) => el?.zone === zona);
  const totalVentasCortesias = totalCortesias?.length + salesTotal +totalGeneral;
  const available = zoneAforo?.aforo - totalVentasCortesias;



  console.log("obteniendo tikets");

  const recervationTime = new Date();
  const expirationTime = add(new Date(), { minutes: 15 });
  const reservatioId = v1();

  let generalPlaceRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("general-place")
    .where("estado", "==", "ok");

if (available <= 0) {

  res.send({
    message: "Zona Agotada.",
    isSuccess: false,
    totalRecerved:totalGeneral
  });
  return ;
} else if (available - cantidad < 0) {
  res.send({
    message: "Cantidad sobrepasa lo disponible. Hay " + available + "Puesto/s disponibles",
    isSuccess: false,
    
  });
}else{




  if (zona) generalPlaceRef = generalPlaceRef.where("zona", "==", zona);
  generalPlaceRef = generalPlaceRef.limit(parseInt(cantidad));
  const recerveVationRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("recervations")
    .doc(reservatioId);

  try {
    let generalPlaceRecerved;
    await dbGB.runTransaction(async (t) => {
      const generalTiketsResult = await t.get(generalPlaceRef);

      if (
        !generalTiketsResult.empty ||
        generalTiketsResult.docs.length < cantidad
      ) {
        const generalPlaceForUser = [];
        generalTiketsResult.forEach((place) => {
          const placeToUpdate = {
            ...place.data(),
            estado: "reserved",
            expirationTime,
            reservatioId,
          };

          const ticketForRecervationREf = dbGB
            .collection("events")
            .doc(eventId)
            .collection("general-place")
            .doc(place.id);

          t.update(ticketForRecervationREf, placeToUpdate);

          console.table(placeToUpdate);
          console.log(place.data());
        });

        generalTiketsResult.forEach((data) => {
          generalPlaceForUser.push({
            ...data.data(),
            id: data.id,
          });
        });

        const dataToRecerve = {
          generalPlaceRecerved: generalPlaceForUser,
          recervationTime,
          reservatioId,
          eventId,
          expirationTime,
        };

        if (userData && typeof userData === "object")
          dataToRecerve.userData = userData;
        t.set(recerveVationRef, dataToRecerve);

        console.log("puesto general", generalPlaceForUser);
        generalPlaceRecerved = generalPlaceForUser;
      } else {
        throw new Error(
          "lo siento peor no hay suficiente tiket para la cantidad solicitada actuamente hay "
        );
      }
    });

    res.send({
      message: "tiket general recervado",
      generalPlaceRecerved,
      expirationTime,
      reservatioId,
      eventId,
    });
    return;
  } catch (error) {
    res.send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,
      error,
    });
  }
}
};

export default recervedGeneralPlace;
