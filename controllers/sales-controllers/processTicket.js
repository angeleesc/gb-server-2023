import { dbGB } from "../../firebase/firebase.cjs";

const processTicket = async (req, res) => {

    const { ticketId, eventId, userId } = req.body;


    // const docRef = doc(db, "events", event, "sales", id);

    // return updateDoc(docRef, {
    //     deliveredBy: user,
    //     status: "ENTREGADO",
    //     deliveryDate: new Date()
    // })

    try {

        await dbGB
            .collection("events")
            .doc(eventId)
            .collection("tickets-sold")
            .doc(ticketId)
            .update({
                processBy: userId,
                status: "PROCESADO",
                processDate: new Date()
            });
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
};

export default processTicket;
