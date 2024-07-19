import { FieldValue } from "firebase-admin/firestore";
import { db, dbGB } from "../../firebase/firebase.cjs";
import updateAvaiablePlaceInTables from "../../services/updateCurrentAvailablePlaceInTable.js";

const deleteCourtesiesTransaction = async (req, res) => {
  const { id, eventId } = req.params;

  const { usuario } = req.headers;
  const userRef = db.collection("users-dashboard").doc(usuario);
  const result = await userRef.get();

  const { email } = result.data();
  let cuantity = 0;

  const tablesIds = new Set()

  try {
    let isSucces = false;

    // obtenemos los ids de las mesa para acualizar su disponiblida

    let tableToUpdaId

    await db.runTransaction(async (t) => {
      const billRef = db
        .collection("events")
        .doc(eventId)
        .collection("courtesy-transaction")
        .doc(id);
      const result = await t.get(billRef);
      const { tickets, typePlace } = result.data();
      let lcuantity = 0;

      for (let ticket of tickets) {
        if (typePlace === "chair") {
          // console.log("obteniendo silla");

          // obtenetmos el molde de la zona XD


          const chairsToDeleteRef = db
            .collection("events")
            .doc(eventId)
            .collection("courtesy-tickets")
            .doc(ticket.id);
          // const result = await chairsToDeleteRef.get();

          const chairToUpdateRef = db
            .collection("events")
            .doc(eventId)
            .collection("chairs")
            .doc(ticket.id);

          const chairControlRef = db
            .collection("events")
            .doc(eventId)
            .collection("chairs-controls")
            .doc(ticket.id);

          // obtenemos el id de la silla 
          const chairsResult = await chairToUpdateRef.get()
          const { zona, mesa } = chairsResult.data()

          if (mesa) {
            tablesIds.add(mesa)

          }

          const zoneTaxtTemplateRef = db.collection('events').doc(eventId).collection('config-and-spech').doc(eventId + '-' + zona)
          const zoneTaxtTemplateResult = await zoneTaxtTemplateRef.get()

          const placeToUpdate = {}

          if (zoneTaxtTemplateResult.exists) {
            console.log('hay resultado')
            const { taxtData } = zoneTaxtTemplateResult.data()
            for (let taxtKey in taxtData) {
              placeToUpdate[taxtKey] = taxtData[taxtKey]
            }



            // console.log(zoneTaxtTemplateResult.data())
          } else {
            throw new error('lo siento pero la zona no exite')
          }

          placeToUpdate.estado = 'ok'

          console.log(placeToUpdate)



          // console.log('puesto a eliminar XD')
          // console.log(chairsResult.data())


          t.delete(chairsToDeleteRef);
          t.update(chairToUpdateRef, {
            ...placeToUpdate
          });

          t.update(chairControlRef, {
            ...placeToUpdate,
            reason: "reset-place",
            refTransaction: FieldValue.delete(),
            updatedBy: email,
          });

          // console.log(result.data());
        } else {

          console.log('eliminando cosrtesia general ')


          const generalPlaceToUpdateRef = db
            .collection("events")
            .doc(eventId)
            .collection("general-place")
            .doc(ticket.id);

          const { zona } = ticket
          console.log(zona)
          // obtenemos la plantilla de la zona de referencia


          const placeTemplateRef = db.collection('events').doc(eventId).collection('config-and-spech').doc(eventId + '-' + zona)
          console.log()
          const placeTemplateResult = await placeTemplateRef.get()

          const taxtDataToUpdate = {}

          if (placeTemplateResult.exists) {
            // console.log('la zona exite')
            const { taxtData } = placeTemplateResult.data()
            // console.log(taxtData)
            for (let taxtKey in taxtData) {
              taxtDataToUpdate[taxtKey] = taxtData[taxtKey]
            }

            taxtDataToUpdate.estado = 'ok'
            console.log(taxtDataToUpdate)
          } else {
            console.log('la zona no existe XC')
            throw new error('lo siento pero la zona no exite')
          }


          const generalPlaceToDeleteRef = db
            .collection("events")
            .doc(eventId)
            .collection("courtesy-tickets")
            .doc(ticket.id);



          t.delete(generalPlaceToDeleteRef);
          t.update(generalPlaceToUpdateRef, {
            ...taxtDataToUpdate
          });
          cuantity = cuantity + 1;
        }
      }

      t.delete(billRef);
      isSucces = true;

    });

    // console.log(tablesIds)
  

    
    if(tablesIds.size >0){
      const talbesIdsArr = []
      tablesIds.forEach(data => talbesIdsArr.push(data))
      console.log(talbesIdsArr)
      updateAvaiablePlaceInTables(talbesIdsArr, eventId)
    }

    console.log(tablesIds.size)


    if (isSucces) {
      const resData = {
        isSucces,
        message: "exito transacion eliminada",
      };

      if (cuantity > 0) {
        resData.generalTiketDeleted = cuantity;
      }

      res.send(resData);
      return;
    }
  } catch (error) {
    console.log(error);

    res.send({
      message: "lo siento pero ocurrion un error",
      isSucces: false,
    });
    return;
  }


  res.send({
    message: "lo siento pero no se hizo nada",
    true: false,
  });
};

export default deleteCourtesiesTransaction;
