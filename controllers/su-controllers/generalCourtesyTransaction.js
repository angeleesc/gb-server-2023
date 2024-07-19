import { format } from "date-fns";
import { db } from "../../firebase/firebase.cjs";

const generalCourtesyTransaction = async (req, res) => {
  const {
    eventId,
    filaName,
    taxtData,
    reason,
    zonaName,
    quantity,
    // generalZone,
  } = req.body;
  const { usuario } = req.headers;

  console.log("generando una cortesia general");

  try {
    await db.runTransaction(async (t) => {
      let generalPlaceQuery = db
        .collection("events")
        .doc(eventId)
        .collection("general-place")
        .where("estado", "==", "ok");

      if (zonaName)
        generalPlaceQuery = generalPlaceQuery.where("zona", "==", zonaName);
      generalPlaceQuery = generalPlaceQuery.limit(quantity);

      const currentIdRef = db.collection("utils").doc("courtesy-id");
      const resultId = await t.get(currentIdRef);
      const { currentId } = resultId.data();
      const userDataref = db.collection("users-dashboard").doc(usuario);
      const userData = (await userDataref.get()).data();
      const { email, nombre: nombreDeusuario, username } = userData;

      console.log("obteniendo tiket");

      const transactionId = currentId + 1;
      const courtesyOperationId =
        "Cortesia-" + transactionId.toString().padStart(6, "0");

      let total = {
        IVA: (taxtData.IVA * quantity).toFixed(2),
        basePrice: (taxtData.basePrice * quantity).toFixed(2),
        impMunicipal: (taxtData.impMunicipal * quantity).toFixed(2),
        price: (taxtData.price * quantity).toFixed(2),
        servicioDeTaquilla: (taxtData.price * quantity).toFixed(2),
      };

      const eventRef = db.collection("events").doc(eventId);
      const eventFullData = (await t.get(eventRef)).data();
      const result = await t.get(generalPlaceQuery);

      const fecha = new Date();
      const formatFacturationDate = format(fecha, "yyyy MMMM d");
      const formatTime = format(fecha, "HH:mm:ss");

      const tickets = [];

      if (!result.empty) {
        for (let ticket of result.docs) {
          const { zona } = ticket.data();

          const ticketToUpdate = {
            ...taxtData,
            estado: "block",
          };

          const ticketForBill = {
            ...taxtData,
            estado: "block",
            zona,
            zonaName,
            fecha,
            formatFacturationDate,
            formatTime,
            courtesyOperationId,
            type: "standing",
            id: ticket.id,
          };

          if (eventFullData.title)
            ticketForBill.eventName = eventFullData.title;
          if (eventFullData.date) {
            ticketForBill.date = eventFullData.date;
            ticketForBill.FormatDate = format(
              new Date(eventFullData.date._seconds * 1000),
              "MMMM d"
            );
          }
          if (eventFullData.time) {
            ticketForBill.time = eventFullData.time;
            ticketForBill.formatTime = format(
              new Date(eventFullData.time._seconds * 1000),
              "hh:mm a"
            );
          }

          const tiketForUpdateRef = db
            .collection("events")
            .doc(eventId)
            .collection("general-place")
            .doc(ticket.id);

          const tiketCorutesyRef = db
            .collection("events")
            .doc(eventId)
            .collection("courtesy-tickets")
            .doc(ticket.id);

          t.update(tiketForUpdateRef, ticketToUpdate);
          t.set(tiketCorutesyRef, ticketForBill);
          tickets.push(ticketForBill);
        }
      }

      const courtesyData = {
        reason,
        tickets,
        total,
        authorizedUser: username,
        authorizedUserId: usuario,
        fecha,
        formatTime,
        formatFacturationDate,
        courtesyOperationId,
        typePlace: "standing",
      };

      const courtesyTransactionRef = db
        .collection("events")
        .doc(eventId)
        .collection("courtesy-transaction")
        .doc(courtesyOperationId);

      t.set(courtesyTransactionRef, courtesyData);
      t.update(currentIdRef, {
        currentId: transactionId,
      });
    });
  } catch (error) {
    console.log("ecurrio un error");
    console.error(error);
  }

  console.log(req.body);
  res.send({
    message: "transacion de cortesia general creada",
    isSuccess: true,
  });
};

export default generalCourtesyTransaction;
