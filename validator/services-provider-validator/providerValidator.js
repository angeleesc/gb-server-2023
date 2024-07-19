import { check } from "express-validator";
import validateResult from "../../utils/validateResult.js";

const validServices = (value, { req }) => {
  const invalidArrary = [];

  for (let service of value) {
    // console.log(service);
    const { name, basePrice, IVA, precioUnitario, total } = service;
    const errData = {};
    if (!name) errData.name = "name es requerido";
    if (!basePrice) errData.basePrice = "basePrice base es requeirdo";
    if (!IVA) errData.IVA = "IVA es requerido";
    if (!precioUnitario) errData.precioUnitario = "precioUnitario es requerido";
    if (!total) errData.total = "total es requerido";

    if (Object.keys(errData).length > 0) {
      invalidArrary.push(errData);
    }
  }

  if (invalidArrary.length > 0) console.log(invalidArrary);

  if (invalidArrary.length > 0) {
    throw new Error(
      "lo siento pero el array es invalido XC" + JSON.stringify(invalidArrary)
    );
  }
  return true;
};

const validateProvider = [
 
  check("provider").exists().not().isEmpty(),
  check("services").exists().isArray().notEmpty().custom(validServices),
  check("tag").exists().isString(),
  check("createdBy").exists().isEmail(),
  check("buisnessName").exists().isString(),
  check("buisnessRif").exists().isString(),
  check("biusnessResponsible").exists().isString(),
  check("idDocumentBResponsible").exists().isString(),
  check("total").exists().isNumeric(),
  check("eventId").exists().isString(),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export default validateProvider;
