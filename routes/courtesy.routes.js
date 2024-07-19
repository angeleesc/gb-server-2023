import { Router } from "express";
import { dbGB } from "../firebase/firebase.cjs";

const routes = Router();

routes.post("/courtesy-print", async (req, res) => {

    /// las rutas y los controller deben estar serparados en mmodulos diferentes XD

    const { courtesyId, eventId } = req.body;

    try {
        await dbGB
            .collection("events")
            .doc(eventId)
            .collection("courtesy-transaction")
            .doc(courtesyId)
            .update({
                print: true,
                printDate: new Date()
            });

        res.send({
            isSuccess: true,
            message: "Cortesia impresa",
        });

    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }

})

routes.post("/courtesy-send", async (req, res) => {

    /// las rutas y los controller deben estar serparados en mmodulos diferentes XD

    const { courtesyId, eventId, sendTo } = req.body;

    if (!courtesyId || !eventId || !sendTo) {
        res.send({
            isSuccess: true,
            message: "Faltan propiedas por enviar",
        });
    }

    try {
        await dbGB
            .collection("events")
            .doc(eventId)
            .collection("courtesy-transaction")
            .doc(courtesyId)
            .update({
                send: true,
                sendTo: sendTo,
                sendDate: new Date()
            });

        res.send({
            isSuccess: true,
            message: "Cortesia enviada",
        });

    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }

})

const CourtesyRoutes = routes
export default CourtesyRoutes;

