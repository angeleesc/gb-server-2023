import { dbGB } from "../../firebase/firebase.cjs";

const deleteMenberShipSold = async (req, res) => {
  const { saleid, eventId, refId } = req.params;

  console.log(req.params);

  try {
    await dbGB.runTransaction(async (t) => {
      const eventRef = dbGB
        .collection("events")
        .doc(eventId)
        .collection("sales")
        .doc(saleid);

      const result = await t.get(eventRef);

      if (result.exists) {
        console.log(result.data());
        const { credentialId } = result.data();
        const menbershipSoldRef = dbGB
          .collection("events")
          .doc(eventId)
          .collection("membership-sold")
          .doc(credentialId);

        const menbershipResult = await t.get(menbershipSoldRef);
        console.log("datos de la menbrecia para eliminar");
        console.log(menbershipResult.data());

        const { userId, asociatedId } = menbershipResult.data();
        const userMeberRef = dbGB
          .collection("users")
          .doc(userId)
          .collection("streaming-buy")
          .doc(eventId + "-" + credentialId);

        t.delete(eventRef);
        t.delete(menbershipSoldRef);
        t.delete(userMeberRef);

        if (asociatedId) {
          const asociatedRef = dbGB
            .collection("events-logitict")
            .doc(eventId)
            .collection("affiliatePartners")
            .doc(asociatedId)
            .collection("sales")
            .doc(saleid);

          t.delete(asociatedRef);
        }

        if (refId) {
          const referralsRef = dbGB
            .collection("events-logitict")
            .doc(eventId)
            .collection("referrals")
            .doc(refId)
            .collection("sales")
            .doc(saleid);
          t.delete(referralsRef);
        }
      }
    });
  } catch (error) {
    console.log("ocurrio un erro XC");
    console.log(error);
  }

  res.send({
    message: "exito venta eliminada",
    isSuccess: true,
  });
};

export default deleteMenberShipSold;
