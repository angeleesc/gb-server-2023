import { check } from "express-validator";
import { dbGB } from "../../firebase/firebase.cjs";
import validateResult from "../../utils/validateResult.js";

const validateAsociate = [
  check("eventId").custom(async (value, { req }) => {



    if (!value) throw new Error("lo siento pero el id del evento es requerido");

    const eventResult = await dbGB
      .collection("events-logitict")
      .doc(value)
      .collection("affiliatePlans")
      .limit(1)
      .get();
    if (eventResult.empty)
      throw new Error(
        "lo siento pero este evento no tiene planes de asicionados afiliados"
      );

    return true;
  }),

  check("userId").custom(async (value, { req }) => {
    const userReault = await dbGB.collection("users").doc(value).get();
    if (!userReault.exists)
      throw new Error(
        "lo siento pero este usuario no esta en nuestro sistema de authentitcador"
      );

    //CASO GENERAR ENLACE DESDE DASHBOARD
    if (value === "tm2khQKaHQNhrDBH1z6JS6rMkJl1") return true

    const userAsociateResult = await dbGB
      .collection("events-logitict")
      .doc(req.body.eventId)
      .collection("affiliatePartners")
      .where("userId", "==", value)
      .limit(1)
      .get();

    if (!userAsociateResult.empty) throw new Error("lo siento pero este usuarioa ya tiene un link de asociado");


    return true;
  }),

  async (req, res, next) => {
    const remainingAffiliateCouponResult = await dbGB.collection("events-logitict").doc(req.body.eventId).get();

    if (remainingAffiliateCouponResult.data().remainingAffiliateCoupon <= 0) return res.status(403).json({
      message: "lo siento pero ya alcanzo el limite de afiliados por este eventos"
    })

    next();

  },

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export default validateAsociate;
