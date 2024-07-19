import { dbGB, gbAuth } from "../../firebase/firebase.cjs";

const createTicketTemplate = async (req, res) => {
    const { data, eventId } = req.body;

    // si todos los datos son requeridos esta bien pero si hay algun dato que por x y siscustancia no es requerido como hace para manipular ese caso XD

    const ticketTemplateShema = {
        addresEvent: data.addresEvent,
        centerImgEvent: data.centerImgEvent,
        dayEvent: data.dayEvent,
        logo1Event: data.logo1Event,
        specifiDateEvent: data.specifiDateEvent,
        subtitle: data.subtitle,
        title: data.title,
        logo2Event: data.logo2Event,
        idTemplate: data.idTemplate ? data.idTemplate : 1,
    }

    try {
        await dbGB
            .collection("ticket-templates")
            .doc(eventId)
            .set(ticketTemplateShema);
        res.send({
            isSuccess: true,
            message: "Template ajustado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
};
export default createTicketTemplate

