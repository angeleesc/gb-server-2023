import { Router } from "express";
import toSellMemberShip from "../controllers/menbership-controllers/toSellMemberShip.js";
import updateSellMenberShip from "../controllers/menbership-controllers/updatesSellMemberShip.js";
import deleteMenberShipSold from "../controllers/menbership-controllers/deleteMenberShipSold.js";
import suValidator from "../middleware/suValidator.js";


const routes = Router();

routes.get("/", (req, res) => {
  res.send({
    message: "esta en la ruta correcta",
  });
});

routes.post("/to-sell-membership", toSellMemberShip);
routes.put("/update-sell/:saleid/:eventId", suValidator, updateSellMenberShip);
routes.delete("/delete-sell-member/:saleid/:eventId", suValidator, deleteMenberShipSold )

export default routes;
