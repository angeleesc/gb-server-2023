import { check } from "express-validator";
import validateResult from "../../utils/validateResult.js";

const generalRecerveValidator = [
  check("cantidad")
    .exists()
    .isNumeric()
    .custom((value, { req }) => {
      if(value > 150){
        throw new Error('lo siento pero se permite un maximos de 150 entradas por operacion')
      }
      return true;
    }),
  check("eventId").exists().isString(),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export default generalRecerveValidator;