import { dbGB } from "../../firebase/firebase.cjs";

const processCourtesyTicket = async (req, res) => {

    const { ticketId, eventId, userId } = req.body;

    if (!ticketId || !eventId || !userId) {
        res.send({
            isSuccess: false,
            message: "Faltan propiedades",
        });
    }

    try {

        await dbGB
            .collection("events")
            .doc(eventId)
            .collection("courtesy-tickets")
            .doc(ticketId)
            .update({
                processBy: userId,
                status: "PROCESADO",
                processDate: new Date()
            });

        await dbGB
            .collection("events")
            .doc(eventId)
            .collection("courtesy-entrance")
            .add({
                processBy: userId,
                ticketId: ticketId,
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
};

export default processCourtesyTicket;
