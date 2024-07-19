import { dbGB, gbAuth } from "../../firebase/firebase.cjs";


const createUser = async (req, res) => {
    const { data } = req.body;

    // si todos los datos son requeridos esta bien pero si hay algun dato que por x y siscustancia no es requerido como hace para manipular ese caso XD


    const userShema = {
        email: data.email,
        password: data.Contraseña,
        rol: data.rol,
        createdAt: new Date(),
        event: data.event ? data.event : []
    }

    try {
        const userRecord = await gbAuth.createUser({
            email: userShema.email,
            emailVerified: false,
            password: userShema.password,
            displayName: userShema.email,
            disabled: false,
        })
        await dbGB
            .collection("users-dashboard")
            .doc(userRecord.uid)
            .set(userShema);
        res.send({
            isSuccess: true,
            message: "Usuario Creado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
};
export default createUser

