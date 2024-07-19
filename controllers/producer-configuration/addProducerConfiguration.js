import { dbGB } from "../../firebase/firebase.cjs";

const addProducerConfiguration = async (req, res) => {
    const { methodsConfigure, eventId } = req.body;

    // si todos los datos son requeridos esta bien pero si hay algun dato que por x y siscustancia no es requerido como hace para manipular ese caso XD

    let producerConfigurationShema = {
        productionCompanyName: eventId,
        methodsConfigure: methodsConfigure
    }

    try {
        await dbGB
            .collection("production-companies")
            .doc(eventId)
            .set(producerConfigurationShema);
        res.send({
            isSuccess: true,
            message: "Configuración ajustada",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
};
export default addProducerConfiguration

