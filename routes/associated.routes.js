import { Router } from "express";
import createAsociate from "../controllers/associated-controllers/createAsociates.js";
import createPartnerPlan from "../controllers/associated-controllers/createPlan.js";
import validateAsociate from "../validator/afiate-validators/afiliateValidators.js";
const routes = Router();

routes.post("/create-asociates", ...validateAsociate, createAsociate);
routes.post("/create-asociates-plan", createPartnerPlan);


export default routes;
