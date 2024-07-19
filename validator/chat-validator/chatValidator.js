import { check } from "express-validator";
import { dbGB } from "../../firebase/firebase.cjs";
import validateResult from "../../utils/validateResult.js";

// {
//     userId,
//     avatar,
//     message,
// }

const validarUsuario = async (value, { req }) => {
  const userSchema = {
    email: true,
    displayName: true,
  };

  if (!value) {
    throw new Error("lo siento per el  id del usuario es requerido");
  }

  const userRef = dbGB.collection("users").doc(value);
  const result = await userRef.get();

  if (!result.exists) throw new Error("lo siento pero el usuario no exite");

  console.log(result.data());
  for (let keySchema in userSchema) {
    if (result.data()[keySchema])
      req.body[keySchema] = result.data()[keySchema];
  }

  return true;
};

const validatechat = [
  check("userId").custom(validarUsuario),
  check("message").isString().exists(),
  check("destination").custom(async (value, { req }) => {
    console.log(req.url);

    if (req.url === "/private-chat") {
      console.log("esta en chat privado");

      if (!value)
        throw new Error("lo siento per el  id del destinatario es requerido");

      const userRef = dbGB.collection("users").doc(value);
      const result = await userRef.get();

      if (!result.exists)
        throw new Error("lo siento pero el destinatiari no exite");

      if (result.data().email) req.body.destinatioEmail = result.data().email;
      if (result.data().displayName)
        req.body.destinationDisplayName = result.data().displayName;
    }

    return true;
  }),

  check("eventId").custom((value, { req }) => {
    if (req.url === "/event-room-chat") {
      if (!value)
        throw new Error("lo siento pero el id del evento es requerido");
    }

    return true;
  }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export default validatechat;
