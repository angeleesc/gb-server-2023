import { Router } from "express";
import createHistory from "../controllers/histories-controllers/createHistorys.js";
import fileValidator from "../validator/utils-validatos/filesValidator.js";
import userValidator from "../validator/utils-validatos/userValidator.js";
const routes = Router();

routes.post(
  "/upload-histories",
  fileValidator,
  userValidator,
 createHistory
);

export default routes;
