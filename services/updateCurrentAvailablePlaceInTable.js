import { db } from "../firebase/firebase.cjs"

export default async function updateAvaiablePlaceInTables(tables, eventId) {

    // obtenemos todas la sillas asociadas a la mesa
    
    for (let tableId of tables) {
        let chairsAvaiable = 0
        
        const charisQuery = db.collection('events').doc(eventId).collection('chairs').where('mesa', '==', tableId);
        const reauslt = await charisQuery.get()

        if (!reauslt.empty) {
            console.log('hay silla asociada al lugar')
            for (let chair of reauslt.docs) {
                const { estado } = chair.data()
                if (estado === 'ok' || estado === 'recerved') chairsAvaiable++
            }
        }

        // console.log('sillas disponible', chairsAvaiable)
        const tableToUpdateRef = db.collection('events').doc(eventId).collection('tables').doc(tableId)
        await tableToUpdateRef.update({
            Disponible: chairsAvaiable
        })
    }

    //solo filtramos la que estan en el estado ok XD




    console.log(tables)

}