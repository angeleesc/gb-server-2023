import { dbGB } from "../../firebase/firebase.cjs";

const changeStatusToPrinted = async (req, res) => {

    const { saleId, eventId } = req.body;

    const sales = dbGB
        .collection("events")
        .doc(eventId)
        .collection("sales");


    try {
        const saleRef = sales.doc(saleId);
        const sale = await saleRef.get()

        if (sale.exists) {
            const saleRefWhitIsPrinted = { ...sale.data(), isPrint: true };
            await saleRef.update(saleRefWhitIsPrinted);
        } else {
            res.send({ message: "Ocurrio un error", isSuccess: false });
        }
        res.send({ message: "Orden impresa", isSuccess: true });

    } catch (err) {
        console.log(err)
        res.send({ message: "Ocurrio un error", isSuccess: false });

    }

};

export default changeStatusToPrinted;
