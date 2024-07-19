import { dbGB } from "../../firebase/firebase.cjs";


const deleteTicketTemplate = async (req, res) => {
    const { eventId } = req.body;

    if (!eventId) {
        res.send({
            isSuccess: false,
            message: "Se requiere id del evento",
        });
    }

    try {
        await dbGB
            .collection("ticket-templates")
            .doc(eventId)
            .delete();
        res.send({
            isSuccess: true,
            message: "Template eliminado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en petición",
        });
    }
};
export default deleteTicketTemplate
