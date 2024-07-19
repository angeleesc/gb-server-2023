import { db } from "../firebase/firebase.cjs";
import { networkInterfaces } from "os";


const binnacleUsers = async (req, res, next) => {

    const { usuario } = req.headers;
    const { url } = req;

    if (!usuario) {
        return res.status(403).send({
            message: "para el uso de esta ruta es obigatorio el uso del usuario",
            isSucces: false,
        });
    }

    const userRef = db.collection("users-dashboard").doc(usuario);
    const result = await userRef.get();

    if (!result.exists) {
        res.status(403).send({
            message: "este usuario no tiene cuenta en el dhasboars",
            isSucces: false,
        });
        return;
    }

    if (
        !(
            result.data().rol === "su" ||
            result.data().rol === "yo" ||
            result.data().rol === "master"
        )
    ) {
        res.status(403).send({
            message:
                "lo siento pero no tiene privilegios para realizar dicha operacion",
        });
        return;
    } else {

        const nets = networkInterfaces();
        const results = Object.create(null); // Or just '{}', an empty object

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
                const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
                if (net.family === familyV4Value && !net.internal) {
                    if (!results[name]) {
                        results[name] = [];
                    }
                    results[name].push(net.address);
                }
            }
        }
        await db.collection("userLog").add({ user: { email: result.data().email }, action: url, createdAt: new Date(), type: "request", location: results ? results : false });
    }
    next();
};

export default binnacleUsers;
