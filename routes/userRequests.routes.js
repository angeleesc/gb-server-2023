import { Router } from "express";
import createUserRequest from "../controllers/user-service-requests/createRequest.js";
import sendRequestToUser from "../controllers/user-service-requests/sendRequestToUser.js";
import updateStatusRequestUser from "../controllers/user-service-requests/updateStatusRequestUser.js";

const routes = Router();

routes.post("/send-request-to-user", sendRequestToUser);

routes.post("/update-status-request-user", updateStatusRequestUser);

routes.post("/create-request", createUserRequest);


export default routes;
