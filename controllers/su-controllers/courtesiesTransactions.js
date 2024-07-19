import { format } from "date-fns";
import { db } from "../../firebase/firebase.cjs";
import updateAvaiablePlaceInTables from "../../services/updateCurrentAvailablePlaceInTable.js";

export default async function courtesyTransaction(req, res) {
  const {
    chairs,
    reason,
    beneficiaryData,
    eventId,
    filaName,
    mesaName,
    localidad,
    taxtData,
  } = req.body;
  const { usuario } = req.headers;

  // console.log(req.body);

  console.log("generando Cortesia");
  console.log("chair to update");
  const tableToUdateAvaiableSet = new Set()

  try {
    await db.runTransaction(async (t) => {
      const currentIdRef = db.collection("utils").doc("courtesy-id");
      const resultId = await t.get(currentIdRef);
      const { currentId } = resultId.data();
      const userDataref = db.collection("users-dashboard").doc(usuario);
      const userData = (await userDataref.get()).data();

      const { email, nombre: nombreDeusuario, username } = userData;

      const fecha = new Date();
      const formatFacturationDate = format(fecha, "yyyy MMMM d");
      const formatTime = format(fecha, "HH:mm:ss");

      console.log("taxt data ");
      console.log(taxtData);

      const transactionId = currentId + 1;
      const courtesyOperationId =
        "Cortesia-" + transactionId.toString().padStart(6, "0");

      console.log(currentId);
      const chairsToUpdate = [];
      const tickets = [];

      let vipQuantity = null;

      let total = {
        basePrice: 0,
        IVA: 0,
        impMunicipal: 0,
        price: 0,
      };

      if (chairs && Array.isArray(chairs)) {
        vipQuantity = chairs.length;



        for (let chair of chairs) {




          const chairRef = db
            .collection("events")
            .doc(eventId)
            .collection("chairs")
            .doc(chair.chairId);
          const chairResult = await t.get(chairRef);
          const { chairId, localTaxt, localBeneficiaryData } = chair;


          const cortesiesRef = db
            .collection("events")
            .doc(eventId)
            .collection("courtesy-tickets")
            .doc(chair.chairId);

          const chairControlRef = db
            .collection("events")
            .doc(eventId)
            .collection("chairs-controls")
            .doc(chair.chairId);

          if (chairResult.exists) {
            const { zona, fila, mesa } = chairResult.data();
            const chairData = chairResult.data();
            let data = {
              id: chairResult.id,
              courtesyOperationId,
              formatFacturationDate,
              ...chairData,
              chairId,
              zona,
              fila,
              typePlace: "chair",
            };

            if (mesa) tableToUdateAvaiableSet.add(mesa)


            let tiketDataToUpdate = {
              estado: "block",
            };

            if (chair.localTaxt) {
              data = {
                ...data,
                ...localTaxt,
              };
              tiketDataToUpdate = {
                ...tiketDataToUpdate,
                ...localTaxt,
              };
            } else {
              data = {
                ...data,
                ...taxtData,
              };
              tiketDataToUpdate = {
                ...tiketDataToUpdate,
                ...taxtData,
              };
            }

            let chairControlData = {
              ...tiketDataToUpdate,
              reason: "corteies",
              refTransaction: courtesyOperationId,
              updatedBy: email,
            };

            if (chair.localBeneficiaryData) {
              data = {
                ...data,
                localBeneficiaryData,
              };
            } else {
              data = {
                ...data,
                ...(beneficiaryData && beneficiaryData)
              };
            }

            if (filaName) data.filaName = filaName;
            if (mesaName) data.mesaName = mesaName;
            if (localidad) data.localidad = localidad;

            tickets.push(data);

            console.log(data);
            chairsToUpdate.push({
              ref: chairRef,
              cortesiesRef,
              chairControlRef,
              data,
              tiketDataToUpdate,
              chairControlData,
            });
          }
        }



        for (let chairU of chairsToUpdate) {



          total.basePrice += chairU.tiketDataToUpdate.basePrice;
          total.IVA += chairU.tiketDataToUpdate.IVA;
          total.impMunicipal += chairU.tiketDataToUpdate.impMunicipal;
          total.price += chairU.tiketDataToUpdate.price;

          t.update(chairU.ref, chairU.tiketDataToUpdate);
          t.update(chairU.chairControlRef, chairU.chairControlData);
          t.set(chairU.cortesiesRef, chairU.data);


        }


      }

      const courtesyTransactionRef = db
        .collection("events")
        .doc(eventId)
        .collection("courtesy-transaction")
        .doc(courtesyOperationId);

      const courtesyData = {
        reason,
        typePlace: "chair",
        total,
        authorizedUser: username,
        authorizedUserId: usuario,
        tickets,
        fecha: new Date(),
      };

      t.set(courtesyTransactionRef, courtesyData);
      t.update(currentIdRef, { currentId: transactionId });

      console.log("transancion exitosa");
    });

    //  console.log(tableToUdateAvaiableSet)
    if (tableToUdateAvaiableSet.size > 0) {
      const tableToUdateAvaiableArr =[]
      tableToUdateAvaiableSet.forEach(data=> tableToUdateAvaiableArr.push(data) )
      console.log(tableToUdateAvaiableArr)
      updateAvaiablePlaceInTables(tableToUdateAvaiableArr, eventId)

    }


  } catch (error) {
    console.log("ocurrio un error");
    console.log(error);
  }

  res.send({
    message: "cortecia creada XD",
    isSucces: true,
  });
}
