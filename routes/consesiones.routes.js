import { Router } from "express";
import business from "../validator/entrepreneur-validator/entrepreneurValidator.js";
import createBusiness from "../controllers/buissness-controlers/createBouisnes.js";
import createContractBuines from "../controllers/buissness-controlers/createContracBuines.js";
import updateBiunesContract from "../controllers/buissness-controlers/updateBuinessContrac.js";
import deleteBouisnessContract from "../controllers/buissness-controlers/deleteBuisnessContract.js";
import createPoll from "../controllers/buissness-controlers/pollBussiness.js";

const routes = Router();

routes.post("/create-business", ...business, createBusiness);
routes.post("/create-contract-business", createContractBuines);
routes.post("/createPoll",createPoll)
routes.put(
  "/update-business-contract/:type/:Rif/:eventId",
  updateBiunesContract
);
routes.delete("/delete-buisness-contact/:type/:Rif/:eventId",deleteBouisnessContract);

export default routes;
