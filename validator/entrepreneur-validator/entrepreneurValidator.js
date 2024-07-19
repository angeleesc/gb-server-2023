import { check } from "express-validator";
import validateResult from "../../utils/validateResult.js";

const validateProvoder = [
  check("Rif").exists().isString(),
  check("type")
    .exists()
    .custom((value, { req }) => {
      if (
        !(
          value === "entrepreneur" ||
          value === "supplier" ||
          value === "sponsor"
        )
      ) {
        throw new Error(
          "solo en case permite estos valores entrepreneur, supplier,sponsor"
        );
      }

      return true;
    }),
  check("businessHomeAddress").exists().isString(),
  check("representativeSFullName").exists().isString(),
  check("brandName").exists().isString(),
  check("rubro").exists().isString(),
  check("phone").exists().isString(),
  check("email").exists().isEmail(),
  check("socialNetwork")
    .exists()
    .custom((value, { req }) => {
      console.log(typeof value);

      let socialNetwork;

      if (typeof value === "string") {
        try {
          socialNetwork = JSON.parse(value);
        } catch (error) {
          throw new Error('lo siento pero el valor si esta utilizando multiparformdata debe ser un json parseado XC')
        }
      }else{
        socialNetwork = value
      }

      const arr = [];

      if (!Array.isArray(socialNetwork)) {
        throw new Error("lo siento pero debe ser un array");
      }

      if (socialNetwork.length <= 0) {
        throw new Error(
          "lo siento pero el debes tener al menos una red social"
        );
      }

      const invalidSocial = [];

      socialNetwork.forEach((social) => {
        const errSocial = {};
        const { name, account } = social;

        if (!name)
          errSocial.name =
            "lo siento pero en nombre de la red social es requerido";
        if (!account)
          errSocial.account =
            "lo siento pero la cuenta de facebook es requerida";

        if (Object.keys(errSocial).length > 0) invalidSocial.push(errSocial);
      });

      if (invalidSocial.length > 0)
        throw new Error(
          "lo sieto peor este arreglo de red social es invalido " +
            JSON.stringify(invalidSocial)
        );

      return true;
    }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

export default validateProvoder;
