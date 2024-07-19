import { dbGB } from "../../firebase/firebase.cjs";

const updateStatusRequestUser = async (req, res) => {

    const { idRequest, idUser } = req.body
    try {
        await dbGB
            .collection("users-dashboard")
            .doc(idUser)
            .collection("user-requests")
            .doc(idRequest)
            .update({ view: true });
        res.send({
            isSuccess: true,
            message: "Estado de solicitud cambio",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
}

export default updateStatusRequestUser
