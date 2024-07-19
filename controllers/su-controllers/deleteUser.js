import { dbGB } from "../../firebase/firebase.cjs";


const deleteUser = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        res.send({
            isSuccess: false,
            message: "Se requiere userId",
        });
    }

    try {
        await dbGB
            .collection("users-dashboard")
            .doc(userId)
            .delete();
        res.send({
            isSuccess: true,
            message: "Usuario Editado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en petición",
        });
    }
};
export default deleteUser
