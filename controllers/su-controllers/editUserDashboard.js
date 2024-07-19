import { dbGB } from "../../firebase/firebase.cjs";


const editUserDashboard = async (req, res) => {
    const { data, userId } = req.body;

    const userEditShema = {
        event: data.event,
        rol: data.rol,
        lastModilastModified: new Date()
    }

    try {

        await dbGB
            .collection("users-dashboard")
            .doc(userId)
            .update({ ...userEditShema });
        res.send({
            isSuccess: true,
            message: "Usuario Editado",
        })

    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
};
export default editUserDashboard

