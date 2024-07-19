import { db } from "../../firebase/firebase.cjs";

const createStartCheckoutReport = async (req, res) => {
    const { data } = req.body;

    try {
        await db.collection('reports', 'startCheckout').add(data);
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

export default createStartCheckoutReport;
