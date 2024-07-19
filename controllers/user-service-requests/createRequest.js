
import { dbGB } from "../../firebase/firebase.cjs";

const createUserRequest = async (req, res) => {

    // si todos los datos son requeridos esta bien pero si hay algun dato que por x y siscustancia no es requerido como hace para manipular ese caso XD

    const {
        affair,
        event,
        service,
        user,
    } = req.body

    const shema = {
        affair: affair ? affair : "",
        event: event,
        service: service,
        user: user,
    }


    try {

        await dbGB
            .collection("users-requests").add(
                {
                    ...shema
                }
            )
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
export default createUserRequest
