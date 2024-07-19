import { Router } from "express";
import { dbGB } from "../firebase/firebase.cjs";
const routes = Router();

routes.post("/create-user", async (req, res) => {
  const userSchema = {
    displayName: true,
    email: true,
    photoURL: true,
    phoneNumber: true,
  };

  const { userId } = req.body;

  const userData = {};

  for (let key in userSchema) if (req.body[key]) userData[key] = req.body[key];

  userData.createAt = new Date();

  const refUser = dbGB.collection("users").doc(userId);

  await refUser.set(userData);

  res.status(200).json({
    message: "usuario agregado",
    isSucces: true,
  });
});

export default routes;
