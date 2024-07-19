import { check } from "express-validator";
import validateResult from "../../utils/validateResult.js";

// {
//     eventId,
//     placeRecerve,
//     generalPlaceRecerved,
//     tablePlace,
//     tablesRecerver,
//     fecha: dateFrom,
//     userId,
//     cantidad,
//     zona,
//     lugarDeVenta,
//     metodoDePago,
//     vendedor,
//     referenciaDePagoDePsarela,
//     DatosDelComprador,
//   }

const sellValidator = [
  // check("eventId").exists().isString(),
  // check("placeRecerve").isArray(),
  // check("generalPlaceRecerved").isArray(),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];


export default sellValidator