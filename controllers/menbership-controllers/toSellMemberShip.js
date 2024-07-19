import { format } from "date-fns";
import { dbGB } from "../../firebase/firebase.cjs";
import {
  generateUniqueCredentialID,
  generateUniQueEventFacturation,
} from "../../utils/uniueHasGenerator.js";

const toSellMemberShip = async (req, res) => {
  const {
    eventId,
    menbershipPlanID,
    fecha: dateFrom,
    userId,
    lugarDeVenta,
    metodoDePago,
    vendedor,
    referenciaDePagoDePsarela,
    DatosDelComprador,
    refId,
    asociatedId,
  } = req.body;

  const fecha = dateFrom ? new Date(dateFrom) : new Date();
  const formatFacturationDate = format(fecha, "uuuu-LL-dd");
  const formatDate = format(fecha, "MMMM d");
  const formatTime = format(fecha, "HH:mm:ss");
  const dataToSet = {};

  const idTag = generateUniQueEventFacturation();
  const saleId = idTag.id;

  const userRef = dbGB.collection("users").doc(userId);
  const utilsDollarRef = dbGB.collection("utils").doc("dollar");
  const menbershipPlanIDRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("menbershipPlans")
    .doc(menbershipPlanID);

  const menbershipSolldRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("membership-sold");

  const salesRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("sales")
    .doc(saleId);

  const userPerSonalMenberShipRef = userId
    ? dbGB.collection("users").doc(userId).collection("streaming-buy")
    : null;


  // creamos la operacion de trasacion es decris informacion del taxt

  try {
    await dbGB.runTransaction(async (t) => {
      const menbershipPlanResult = await menbershipPlanIDRef.get();
      const userResult = await userRef.get();

      const tasaDelDolarToBs = (await utilsDollarRef.get()).data().tasa;
      if (menbershipPlanResult.exists) {
        const menberShipCredentialsID = generateUniqueCredentialID(
          menbershipPlanResult.id
        );
        console.log(menberShipCredentialsID);

        const credentialData = {
          ...menbershipPlanResult.data(),
          credentialId: menberShipCredentialsID,
          saleId,
        };

        if (!userResult.exists)
          throw new Error(
            "lo siento pero para las ventas de streaming es nesesario estar afiliado al sitio global boletos "
          );

        credentialData.userId = userId;
        credentialData.email = userResult.data().email;

        const precioTotal = menbershipPlanResult.data().price;
        console.log("precioTotal", precioTotal);

        console.log(menbershipPlanResult.data());

        const saleData = {
          ...menbershipPlanResult.data(),
          tasaDelDolarToBs,
          lugarDeVenta,
          metodoDePago,
          precioTotal,
          vendedor,
          referenciaDePagoDePsarela,
          comprador: DatosDelComprador,
          credentialId: menberShipCredentialsID,
          fecha,
          saleId,
          formatDate,
          formatTime,
          formatFacturationDate,
          eventId,
          saleTag: idTag,
        };

        if (asociatedId) saleData.asociatedId = asociatedId;
        if (refId) saleData.refId = refId;

        dataToSet.credentialData = credentialData;
        dataToSet.datosGeneralesDelaVenta = saleData;

        t.set(menbershipSolldRef.doc(menberShipCredentialsID), credentialData);
        t.set(salesRef, saleData);
        if (userId)
          t.set(
            userPerSonalMenberShipRef.doc(
              eventId + "-" + menberShipCredentialsID
            ),
            credentialData
          );
        if (asociatedId)
          t.set(
            dbGB
              .collection("events-logitict")
              .doc(eventId)
              .collection("affiliatePartners")
              .doc(asociatedId)
              .collection("sales")
              .doc(saleId),
            saleData
          );

        if (refId)
          t.set(
            dbGB
              .collection("events-logitict")
              .doc(eventId)
              .collection("referrals")
              .doc(refId)
              .collection("sales")
              .doc(saleId),
            saleData
          );

        return;
      }

      throw new Error("lo siento pero el id de menbresia es invalido");
    });
  } catch (error) {
    console.log("ocurrion un error");
    console.log(error);
    res.send({
      message: "lo siento pero ocurrio un error",
      error,
      isSuccess: false,
    });
    return;
  }

  res.send({
    message: "exito",
    isSuccess: true,
    ...dataToSet,
  });
};

export default toSellMemberShip;
