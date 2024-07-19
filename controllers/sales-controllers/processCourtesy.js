import { dbGB } from "../../firebase/firebase.cjs";

const processCourtesy = async (req, res) => {

    const { saleId, eventId, userId } = req.body;
    
    if (!saleId || !eventId || !userId) {
        res.send({
            isSuccess: false,
            message: "Faltan propiedades",
        });
    }

    try {

        await dbGB
            .collection("events")
            .doc(eventId)
            .collection("courtesy-transaction")
            .doc(saleId)
            .update({
                deliveredBy: userId,
                status: "ENTREGADO",
                deliveryDate: new Date()
            });

        res.send({
            isSuccess: true,
            message: "Factura entregada",
        });

    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }





};

export default processCourtesy;
