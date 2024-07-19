import { db } from "../../firebase/firebase.cjs";

export default async function addInvoiceToDispute(req, res) {

    const { hashId, eventId, authorizedUser, reason } = req.body;

    if (!(hashId)) {
        res.send({
            message:
                "hashId Requerido",
            isSucces: false,
        });
        return;
    }

    let idToUpdateRef;

    try {

        await db.runTransaction(async (t) => {

            if (hashId) {
                idToUpdateRef = db
                    .collection("events")
                    .doc(eventId)
                    .collection("sales")
                    .doc(hashId);
            } else {

            }

            const billToUpdate = await t.get(idToUpdateRef);

            if (billToUpdate.exists) {

                const bdRefDisputedInvoices = db
                    .collection("events")
                    .doc(eventId)
                    .collection("disputed-invoices")
                    .doc(hashId);

                t.set(bdRefDisputedInvoices, { ...billToUpdate.data(), disputeReason: reason, authorizedUser: authorizedUser, startOfDispute: new Date() });
            }
        });

        res.send({
            isSuccess: true,
            message: "exito factura en disputa",
        });


    } catch (error) {
        console.log(error)
        res.send({
            isSuccess: false,
            message: "Error en operación",
        });
    }
}
