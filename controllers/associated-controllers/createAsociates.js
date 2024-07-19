import { FieldValue } from "firebase-admin/firestore";
import { dbGB } from "../../firebase/firebase.cjs";
import { generateAscociatedId } from "../../utils/uniueHasGenerator.js";

const createAsociate = async (req, res) => {
  const { userId, eventId, planId, codeId } = req.body;


  console.log("CODIGO", codeId)

  const configResult = await dbGB
    .collection("events-logitict")
    .doc(eventId)
    .get();

  const topAfillieter = configResult.data().associatedMarketersTop;
  const userData = (await dbGB.collection("users").doc(userId).get()).data();

  let planProperties = {}
  let isUnique = true;
  let ids;

  if (planId) {
    const asociatedDataRefCommission = await dbGB
      .collection("events-logitict")
      .doc(eventId)
      .collection("affiliatePlans")
      .doc(planId)
      .get()
    if (asociatedDataRefCommission.exists) {
      if (asociatedDataRefCommission.data().typeOfCommission === "Fixed") {
        planProperties = {
          affiliateCommission: asociatedDataRefCommission.data().commission,
          customerDiscount: asociatedDataRefCommission.data().customerDiscount,
          typeOfCommission: asociatedDataRefCommission.data().typeOfCommission
        }
      }
    }
  } else {
    const asociatedDataRefCommission = await dbGB
      .collection("events-logitict")
      .doc(eventId)
      .collection("affiliatePlans")
      .doc("afiliados")
      .get()
    if (asociatedDataRefCommission.exists) {
      if (asociatedDataRefCommission.data().typeOfCommission === "Fixed") {
        planProperties = {
          affiliateCommission: asociatedDataRefCommission.data().commission,
          customerDiscount: asociatedDataRefCommission.data().customerDiscount,
          typeOfCommission: asociatedDataRefCommission.data().typeOfCommission
        }
      }
    }
  }


  // este ciclo whike premite validar si el id es unico

  if (codeId) {
    ids = { id: codeId, refEventId: eventId }
  } else {
    while (isUnique) {
      ids = generateAscociatedId(eventId, topAfillieter);
      const idsResult = await dbGB
        .collection("events-logitict")
        .doc(eventId)
        .collection("affiliatePartners")
        .doc(ids.id)
        .get();

      if (!idsResult.exists) {
        const validId = /[ABCDEFG12345]/g;
        if (validId.test(ids.id)) console.log(ids);
        isUnique = false;
      }
      console.log("no exite");
    }
  }



  const affiliateMarketingData = {
    ...userData,
    userId,
    asociateId: ids.id,
    refEventId: ids.refEventId,
    affiliateLinkParche: `https://globalboletos.com/Event/${eventId}-${ids.id}`,
    affiliateLink: `https://globalboletos.com/Event/checkout/${eventId}-${ids.id}`,
    planProperties: planProperties,
    createdAt: new Date()
  };

  await dbGB
    .collection("events-logitict")
    .doc(eventId)
    .update({
      remainingAffiliateCoupon: FieldValue.increment(-1),
    });

  await dbGB
    .collection("events-logitict")
    .doc(eventId)
    .collection("affiliatePartners")
    .doc(ids.id)
    .set(affiliateMarketingData);

  await dbGB
    .collection("users")
    .doc(userId)
    .collection("affiliatePartners")
    .doc(ids.id)
    .set(affiliateMarketingData);

  res.send({
    isSuccess: true,
    message: "exito usuario agregado",
  });
};

export default createAsociate;
