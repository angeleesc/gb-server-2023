import { dbGB } from "../../firebase/firebase.cjs";


const sendRequestToUser = async (req, res) => {

    const { fromEmail, fromId, to, reason } = req.body


    const requestSchema = {
        createdAt: new Date(),
        reason: reason,
        fromEmail: fromEmail,
        fromUserId: fromId,
    }


    try {

        await dbGB
            .collection("users-dashboard")
            .doc(to)
            .collection("user-requests")
            .add(requestSchema);

        res.send({
            isSuccess: true,
            message: "Solicitud enviada",
        });

    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
};
export default sendRequestToUser
