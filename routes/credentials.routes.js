import { Router } from "express";
import { db, dbGB } from "../firebase/firebase.cjs";

const routes = Router();

routes.delete("/delete-credential/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection("staff").doc(id).delete();
    } catch (err) {
        console.log("ocurrio un error");
        console.log(err);
        res.send({
            message: "lo siento pero ocurrio un error",
            isSuccess: false,
        });
    }
    res.send({ message: "Exito credencial eliminada", isSuccess: true });
})

routes.post("/update-credential/", async (req, res) => {
    const { credentialId } = req.body;
    try {
        await dbGB
            .collection("staff")
            .doc(credentialId)

            .update({
                print: true
            });

        res.send({
            isSuccess: true,
            message: "Credencial impresa",
        });

    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
})

routes.post("/edit-credential/", async (req, res) => {
    const { credentialId, data } = req.body;

    const credentialShema = {
        name: data.name,
        lastName: data.lastName,
        ci: data.ci,
        rol: data.rol,
        event: data.event
    }

    try {
        await dbGB
            .collection("staff")
            .doc(credentialId)
            .update({
                ...credentialShema
            });
        res.send({
            isSuccess: true,
            message: "Credencial impresa",
        });

    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
})

routes.post("/create-credential", async (req, res) => {
    const { data } = req.body;
    const credentialShema = {
        name: data.name,
        lastName: data.lastName,
        ci: data.ci,
        rol: data.rol,
        event: data.event
    }
    try {
        await db.collection("staff").add({ ...credentialShema, fecha: new Date() });
        return res.send({ message: "Exito credencial creada", isSuccess: true });
    } catch (error) {
        console.log(error);
        res.send({
            message: "Ocurrio un error en la peticion al servidor",
            isSuccess: false,
        });
    }
});
const credentialsRoutes = routes
export default credentialsRoutes;


