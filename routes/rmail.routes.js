import { Router } from "express";
import deletePendingPayment from "../controllers/su-controllers/deletePendingPayment.js";
import { db } from "../firebase/firebase.cjs";
import notificacion from "../templates/newOrder.cjs";

const routes = Router();

routes.post("/pending-payment/delete/:id", deletePendingPayment);


routes.post("/send-qr", async (req, res) => {
  console.log(req.body);
  await notificacion.sendMailNotification(req.body);
  res.send({
    isSuccess: true,
    mesage: "exito mensaje enviado",
  });
});

routes.post("/send-refund", async (req, res) => {
  const { data, eventId } = req.body;
  const refundRef = db.collection("refunds");
  await refundRef.add(data);

  res.send({
    message: "exito rembolso enviado",
    isSuccess: true,
  });
});

const emailRoutes = routes;

export default emailRoutes;
