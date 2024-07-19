import { dbGB, gbAuth } from "../../firebase/firebase.cjs";


const createSeller = async (req, res) => {
    const { data } = req.body;

    const sellerShema = {
        Contraseña: data.Contraseña,
        Puesto_Trabajo: data.Puesto_Trabajo,
        email: data.email,
        print: data.print,
        events: data.events,
        createdAt: new Date(),
        rol: data.rol
    }

    try {

        const userRecord = await gbAuth.createUser({
            email: sellerShema.email,
            emailVerified: false,
            password: sellerShema.Contraseña,
            displayName: sellerShema.email,
            disabled: false,
        })

        await dbGB
            .collection("vendors")
            .doc(userRecord.uid)
            .set(sellerShema);
        res.send({
            isSuccess: true,
            message: "Vendedor Creado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
};
export default createSeller

