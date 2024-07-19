import { format } from "date-fns";
import { db, dbGB } from "../../firebase/firebase.cjs";

export default async function updateSale(req, res) {

    

    const { hashId, eventId, sale } = req.body;



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


                const { numeroDeFactura, fecha } = billToUpdate.data();

                const formatDate = format(
                    new Date(fecha._seconds * 1000),
                    "dd-LL-uuuu"
                );
                const facturasRef = db
                    .collection("reportes-diarios")
                    .doc("reporte-diario")
                    .collection(formatDate)
                    .doc(numeroDeFactura);

                const salesBkRef = db
                    .collection("sales-back-up")
                    .doc(eventId)
                    .collection("sales")
                    .doc(billToUpdate.id);

             //   t.update(facturasRef, { ...sale });
                t.update(salesBkRef, { ...sale });
                t.update(idToUpdateRef, { ...sale });
            }
        });

        res.send({
            isSucces: true,
            message: "exito factura elimina",
        });


    } catch (error) {
        console.log(error)
        res.send({
            isSucces: false,
            message: "Error en operación",
        });
    }
}
