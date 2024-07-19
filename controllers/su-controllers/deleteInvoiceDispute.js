import { dbGB } from "../../firebase/firebase.cjs";


const deleteInvoiceDispute = async (req, res) => {
    const { eventId, disputedId } = req.body;


    const transferPending = dbGB.collection("events").doc(eventId).collection("disputed-invoices").doc(disputedId);

    try {

        await transferPending.delete();

        res.send({
            message: "Exito, eliminado",
            isSuccess: true,
        });

        return
    } catch (error) {

        res.send({
            message: "Ocurrio un error",
            isSuccess: false,
            error
        });

        return
    }

}

export default deleteInvoiceDispute