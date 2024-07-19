import { dbGB } from "../../firebase/firebase.cjs";


const changePendingPaymentStatus = async (req, res) => {

    const { status, pendingPaymentId } = req.body;

    try {
        await dbGB
            .collection("transferPending")
            .doc(pendingPaymentId)
            .update({ status: status });
        res.send({
            isSuccess: true,
            message: "Estado de pago editado",
        });
    } catch (err) {
        // console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
};
export default changePendingPaymentStatus

