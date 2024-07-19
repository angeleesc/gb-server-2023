import { dbGB } from "../firebase/firebase.cjs"
import { customAlphabet } from "nanoid";
import { format } from "date-fns";


export const TiketValidator = async (req, res, next) => {


    // console.log(req.body)

    console.log(req.body)

    const { placeRecerve, eventId } = req.body

    const duplacetedTikets = []

    if (placeRecerve && Array.isArray(placeRecerve)) {

        for (let place of placeRecerve) {

            console.log('validando el tiket', place.idPlace)

            const tiketRef = dbGB.collection('events').doc(eventId).collection('chairs').doc(place.idPlace)
            const result = await tiketRef.get()

            const { estado } = result.data()

            console.log(estado)

            if (estado === 'block') {
                duplacetedTikets.push(result.data())
            }

            //   console.log('tiket a validad')
            //   console.log(result.data())


        }


        if (duplacetedTikets.length > 0) {

            const timeId = new Date()
            const dateId = format(timeId, "y-MMdd-HHmm-ss");
            const nanoid = customAlphabet("1234567890", 10);
            const radomId = nanoid(5);

            const failedTransactionId = `GBFT-${dateId}-${radomId}`
            const failedTransactionRef = dbGB.collection('failed-transactions').doc(failedTransactionId)
            const dataToSend = {
                duplacetedTikets,
                reason: 'duplicated ticket',
                ...req.body
            }
            await failedTransactionRef.set(dataToSend)

            res.send({
                message: 'Operacion fallida hay puesto selecionados que ya estan ocupado Comunicate con tu agente de Globalboletos de confianza (Andres XD) para saber mas informacion Gracias. ',
                isSucces: false

            })
            console.log('puesto duplicado')
            return

        }

    }


    console.log('validando tique')

    next()
}