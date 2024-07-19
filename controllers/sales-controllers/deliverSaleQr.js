import { dbGB } from "../../firebase/firebase.cjs";

const deliverSaleQr = async (req, res) => {

    const { saleId, eventId, userId } = req.body;

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
            .collection("sales")
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

export default deliverSaleQr;
