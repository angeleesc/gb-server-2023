import { Router } from "express";
import createServices from "../controllers/servicers-controller/createServices.js";
import deleteServices from "../controllers/servicers-controller/deletedServices.js";
import updateService from "../controllers/servicers-controller/updateServices.js";
import validateProvider from "../validator/services-provider-validator/providerValidator.js";
import { db } from "../firebase/firebase.cjs";
import searchCne from "../controllers/cne-controllers/searchCne.js";

const routes = Router();

routes.post("/create-services", validateProvider, createServices);

routes.post("/send-require", async (req, res) => {
    const { data } = req.body;
    try {
        await db.collection("clientRequests").add({ ...data, fecha: new Date() });
        return res.send({ message: "Exito requerimiento enviado", isSuccess: true });
    } catch (error) {
        console.log(error);
        res.send({
            message: "Ocurrio un error en la peticion al servidor",
            isSuccess: false,
        });
    }
});

routes.put("/update-services/:servicesId", updateService);
routes.delete("/delete-services/:servicesId/:eventId", deleteServices);


routes.post("/data-cne/", searchCne);


export default routes;
