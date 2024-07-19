import { dbGB } from "../../firebase/firebase.cjs";


const editTicketTemplate = async (req, res) => {
    const { data, ticketId } = req.body;
    try {
        await dbGB
            .collection("ticket-templates")
            .doc(ticketId)
            .update({ ...data, lastModilastModified: new Date() });
        res.send({
            isSuccess: true,
            message: "Ticket editado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en editar boleto",
        });
    }
};
export default editTicketTemplate

