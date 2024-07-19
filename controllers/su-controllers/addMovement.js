import { dbGB } from "../../firebase/firebase.cjs";
import { format } from "date-fns";


const addMovement = async (req, res) => {

    const { amount, description, type, typePayment } = req.body;

    if (!amount || !description || !type || !typePayment) {
        res.send({
            isSuccess: false,
            message: "Error en los valores de las propiedades",
        });
    }

    const movementShema = {
        amount: amount,
        description: description,
        type: type,
        typePayment: typePayment,
        createdAt: new Date(),
    }

    try {


        const formatDate = format(
            new Date(),
            "dd-LL-uuuu"
        );

        await dbGB
            .collection("finance")
            .doc("movements")
            .collection("movements")
            .add(movementShema)

        res.send({
            isSuccess: true,
            message: "Movimiento Creado",
        })

    } catch (err) {
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        })
    }
};
export default addMovement

