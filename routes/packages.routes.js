import { Router } from "express";
import { db, dbGB } from "../firebase/firebase.cjs";


const routes = Router();

routes.post("/request-plan", async (req, res) => {
    const { eventId, zone, price } = req.body;
    try {
        const ref = db.collection("events").doc(eventId).collection("general-place").where("zona", "==", zone)
        const dataRef = await (await ref.get()).docs.map((el) => el.data());
        if (dataRef.length === 0) {
            for (var i = 0; i < 20; ++i) {
                await db.collection("events").doc(eventId).collection("general-place").doc(zone + "-" + i).set({
                    IVA: 0,
                    basePrice: 0,
                    estado: "ok",
                    impMunicipal: 0,
                    price: price,
                    servicioDeTaquilla: 0,
                    ticketId: zone + "-" + i,
                    tiketName: zone + "-" + i,
                    zona: zone
                });
            }
            res.send({
                isSuccess: true,
            });
        } else {
            const available = dataRef.filter(x => x.estado === "ok")
            if (available.length !== 0) {
                res.send({
                    isSuccess: true,
                });
            } else {
                console.log("NO HAY DISPONIBLE")
                for (var i = 0; i < 20; ++i) {
                    await db.collection("events").doc(eventId).collection("general-place").doc(zone + "-" + i).set({
                        IVA: 0,
                        basePrice: 0,
                        estado: "ok",
                        impMunicipal: 0,
                        price: price,
                        servicioDeTaquilla: 0,
                        ticketId: zone + "-" + i,
                        tiketName: zone + "-" + i,
                        zona: zone
                    });
                }
                res.send({
                    isSuccess: true,
                });
            }
        }
    } catch (error) {
        console.log(error)
        console.log("ocurrio un error");
        res.send({
            message: "Ocurrio un error en la peticion al servidor",
            isSuccess: false,
        });
    }
});


// export default createAsociate;

export default routes;
