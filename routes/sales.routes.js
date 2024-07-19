import { Router } from "express";
import deliverSaleQr from "../controllers/sales-controllers/deliverSaleQr.js";
import getAllSales from "../controllers/sales-controllers/getAllSales.js";
import getAllSalesForEvents from "../controllers/sales-controllers/getAllSalesEvents.js";
import getSalesToAdministrative from "../controllers/sales-controllers/getSalesToAdministrative.js";
import processCourtesy from "../controllers/sales-controllers/processCourtesy.js";
import processCourtesyTicket from "../controllers/sales-controllers/processCourtesyTicket.js";
import processTicket from "../controllers/sales-controllers/processTicket.js";
import { dbGB } from "../firebase/firebase.cjs";

const routes = Router();

routes.get("/get-all", getAllSales);
routes.get("/get-sales-to-administrative",getSalesToAdministrative)
routes.post("/get-all-sales-for-events", getAllSalesForEvents);
routes.post("/deliver-sale-qr", deliverSaleQr);
routes.post("/process-ticket", processTicket);

routes.post("/courtesy-entrance-in-justin-quiles", async (req, res) => {
    const { eventId, userId } = req.body;

    try {
        await dbGB
            .collection("events")
            .doc(eventId)
            .collection("courtesy-entrance")
            .add({
                processBy: userId,
                status: "PROCESADO",
                processDate: new Date()
            })

        res.send({
            isSuccess: true,
            message: "Ticket procesado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }

});

routes.post("/tickets-entrance-in-justin-quiles", async (req, res) => {
    const { eventId, userId } = req.body;

    try {
        await dbGB
            .collection("events")
            .doc(eventId)
            .collection("tickets-entrance")
            .add({
                processBy: userId,
                status: "PROCESADO",
                processDate: new Date()
            })

        res.send({
            isSuccess: true,
            message: "Ticket procesado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }

});



routes.post("/process-courtesy-ticket", processCourtesyTicket);

routes.post("/process-courtesy", processCourtesy);



const salesRoutes = routes
export default salesRoutes;

