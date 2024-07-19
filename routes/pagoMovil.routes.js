import { Router } from "express";
import { db } from "../firebase/firebase.cjs";

const routes = Router();

routes.post("/agregar-reporte", async(req, res) => {
  const { pago_movil_referencia } = req.body;

  const pagoMovilRefDoc = db
    .collection("pagos-temporales")
    .doc(pago_movil_referencia);

  await pagoMovilRefDoc.set({...req.body});

  res.send({isSuccess: true, mesages:'datos de pago movil guardado'});

});

export default routes;