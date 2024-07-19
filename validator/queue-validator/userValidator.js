import { check } from "express-validator";
import { dbGB } from "../../firebase/firebase.cjs";
import validateResult from "../../utils/validateResult.js";

const validCustomEmail = async (value, { req }) => {
  const { eventId } = req.body;

  const isInfinityEmail = /(\+)\w+/;
  const isAproveEmail =
    /(yahoo.com)|(gmail.com)|(proton.me)|(protonmail.com)|(outlook.(es|com))|(hotmail.com)|(icloud.com)/g;
  if (isInfinityEmail.test(value))
    throw new Error(
      "lo siento pero no se permiter email de genereador de email"
    );
  if (!isAproveEmail.test(value))
    throw new Error(
      "los siento pero por seguridad y libretad solo permitimo correos de los siuinete dominios: yahoo.com, gmail.com, proton.me, protonmail.com outlook.es/.com hotmail.com, icloud.com"
    );

  const userWhiteListRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("white-list")
    .doc(value);
  const result = await userWhiteListRef.get();
  if (result.exists) throw new Error("lo siento pero este usuario ya exite");

  console.log(value);
  return true;
};

const validateUserWhiteList = [
  check("email").isEmail().custom(validCustomEmail),
  check("eventId").exists().isString(),
  check("instagram").exists().isString(),
  check("firtName").exists().isString(),
  check("lastName").exists().isString(),
  check("city").exists().isString(),
  check("ip")
    .exists()
    .isString()
    .custom(async (value, { req }) => {
      const { eventId } = req.body;
      const ipQuery = dbGB
        .collection("events")
        .doc(eventId)
        .collection("white-list")
        .where("ip", "==", value)
        .limit(1);
      const result = await ipQuery.get();
      if (!result.empty)
        throw new Error("lo siento pero esta pc esta registrada");
      return true;
    }),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export default validateUserWhiteList;
