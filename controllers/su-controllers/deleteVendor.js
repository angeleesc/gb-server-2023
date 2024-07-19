import { dbGB } from "../../firebase/firebase.cjs";


const deleteSeller = async (req, res) => {
    const { sellerId } = req.body;

    if (!sellerId) {
        res.send({
            isSuccess: false,
            message: "Se requiere SellerId",
        });
    }

    try {
        await dbGB
            .collection("vendors")
            .doc(sellerId)
            .delete();
        res.send({
            isSuccess: true,
            message: "Vendedor Eliminado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
};
export default deleteSeller

