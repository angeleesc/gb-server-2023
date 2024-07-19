import { db } from "../firebase/firebase.cjs";

export default async function preventDesaster(req, res, next) {
  console.log(req.headers);
  console.log(res)
  console.log(req)

  const { mesa, eventId, fila } = req.body;

  //   console.log(req);

  switch (req.url) {
    case "/update-all-chairs-of-the-table-by-id":
      const chairsQuery = db
        .collection("events")
        .doc(req.body.eventId)
        .collection("chairs-controls")
        .where("mesa", "==", mesa);

      const result = await chairsQuery.get();

      let hasReferenceTransaction = false;
      const invalidChairs = [];

      if (!result.empty) {
        for (let chairControl of result.docs) {
          console.log("chair to valid");

          console.log(chairControl.data().refTransaction);

          if (chairControl.data().refTransaction) {
            // console.log("este tiene referencia de una venta");
            hasReferenceTransaction = true;
            invalidChairs.push({ ...chairControl.data() });
          }
        }
      }

      if (hasReferenceTransaction) {
        console.log(
          "esta operacion tiene un metodo de transacion en unas de las sillas"
        );
        res.send({
          message:
            "lo siento pero, tienes puesto asociado a una transaccion para devolver los datos debe eliminar la transacion asociada",
          invalidChairs,
          isSuccess: false,
        });
        return;
      }

      next();
      return;

    case "/update-all-selected-chairs":
      const { idPlaces, eventId } = req.body;

      const invalidChairsUS = [];

      for (let ipPlace of idPlaces) {
        const chairControlRef = db
          .collection("events")
          .doc(eventId)
          .collection("chairs-controls")
          .doc(ipPlace);

        const chairResult = await chairControlRef.get();
        if (chairResult.exists) {
          if (chairResult.data().refTransaction) {
            invalidChairsUS.push({ ...chairResult.data() });
          }
        }
      }

      console.log(invalidChairsUS);

      if (invalidChairsUS.length > 0) {
        res.send({
          isSuccess: false,
          message:
            "lo siento pro unas de las sillas selecionasda esta vinculada a una transacion para editar los siguiente puesto es nesesario eliminar la transacion vinculada",
          invalidChairs: invalidChairsUS,
        });
        return;
      }

      next();
      return;

    case "/updates-all-chair-or-table-byo-row":
      console.log("chequeado todas las sillas de la fila");

      let hasmore = true;
      let limit = 5;
      let nextRef = null;

      // console.log(eventId);

      const invalidChairsBr = [];

      while (hasmore) {
        let charisControlByrowQuery = db
          .collection("events")
          .doc(req.body.eventId)
          .collection("chairs-controls")
          .where("fila", "==", fila)
          .orderBy("idPlace");

        if (nextRef)
          charisControlByrowQuery = charisControlByrowQuery.startAfter(nextRef);

        charisControlByrowQuery = charisControlByrowQuery.limit(limit);
        const resultControl = await charisControlByrowQuery.get();

        if (!resultControl.empty) {
          // console.log("hay datos");

          for (let chair of resultControl.docs) {
            console.log("documento a evaluar");

            // console.log(chair.data())

            if (chair.data().refTransaction) {
              // console.log('este puesto esta vinculado a una trasancion');
              invalidChairsBr.push({ ...chair.data() });
            }
          }
        } else {
          console.log("nohay datos");
        }

        if (resultControl.docs.length < limit) {
          hasmore = false;
          console.log("despues de esto no hay nada");
        } else {
          nextRef = resultControl.docs[resultControl.docs.length - 1];
          console.log("hay mas");
        }
      }

      if (invalidChairsBr.length > 0) {
        res.send({
          message:
            "lo siento pero unas de las sillas selecionadas esta vinculada a una transacion y po ende no se puede eliminar",
          invalidChairs: invalidChairsBr,
          isSuccess: false,
        });
        return;
      }

      next();
      return;

    default:
      console.log("ok");
      next();
      return;
  }
}
