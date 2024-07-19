import { dbGB } from "../../firebase/firebase.cjs";

export default async function createNewEvent(req, res){

    const {data} = req.body;

    console.log(data)
    
    // const eventRef = dbGB.collection('events').doc(data.name.replace(' ', '-'));
    // await eventRef.set({
    //     ...data,

    // })

    res.send({
        message: 'evento creado',
        isSucces: true
    })
} 