import { Router } from "express";
import whiteList from "../controllers/queue-controller/whiteList.js";
import { dbGB } from "../firebase/firebase.cjs";
import userClientValidator from "../validator/login-validator/userClientValidator.js";
import validateUserWhiteList from "../validator/queue-validator/userValidator.js";
const routes = Router();

routes.post("/white-list", ...validateUserWhiteList, whiteList);
routes.post("/wait-to-queue", userClientValidator, async (req, res) => {
  const userToWaitSchema = {
    userId: true,
    email: true,
    phoneNumber: true,
  };
  const { userId, eventId } = req.body;
  const waitQueueRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("waiting-queue")
    .doc(userId);

  const userDataToSend = {};

  for (let userKey in userToWaitSchema) {
    if (req.body[userKey]) userDataToSend[userKey] = req.body[userKey];
  }

  await waitQueueRef.set(userDataToSend);

  res.send({
    message: "usuario agregado a al lista XD",
  });
});

export default routes;
