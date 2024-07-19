import { db } from "../../firebase/firebase.cjs";

const createReportWithId = async (req, res) => {
    const { data, id } = req.body;

    try {
        await db.collection('transferPending').doc(id).set(data)
    } catch (error) {
        console.log("ocurrio un error");
        console.log(error);
        res.send({
            message: "lo siento pero ocurrio un error",
            isSuccess: false,
        });
    }
    res.send({ message: "Exito reporte añadido", isSuccess: true });
};

export default createReportWithId;
