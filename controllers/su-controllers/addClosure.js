import { dbGB, gbAuth } from "../../firebase/firebase.cjs";
import { format } from "date-fns";


const addClosure = async (req, res) => {

    const { totals, eventId } = req.body;

    if (!totals || !eventId) {
        res.send({
            isSuccess: false,
            message: "Error en los valores de las propiedades",
        });
    }

    const closureShema = {
        totals: totals,
        eventId: eventId,
        createdAt: new Date(),
    }

    try {


        const formatDate = format(
            new Date(),
            "dd-LL-uuuu"
        );
        
        await dbGB
            .collection("finance")
            .doc("closures")
            .collection("closures")
            .doc(eventId)
            .set(closureShema)

        res.send({
            isSuccess: true,
            message: "Cierre Creado",
        })

    } catch (err) {
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        })
    }
};
export default
    addClosure

