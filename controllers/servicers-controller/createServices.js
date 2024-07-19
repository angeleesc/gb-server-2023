import { db } from "../../firebase/firebase.cjs";

const createServices = async (req, res) => {
  const { total, contributed, eventId, ...data } = req.body;
  console.log(req.body);

  try {
    await db.runTransaction(async (t) => {
      const currentIdRef = db.collection("utils").doc("services-provider-id");

      const currentId = (await t.get(currentIdRef)).data().currentId + 1;
      const servicesId = "ServicesId-" + currentId.toString().padStart(6, "0");

      console.log(servicesId);

      const servicesRef = db
        .collection("events-logitict")
        .doc(eventId)
        .collection("provider-services")
        .doc(servicesId);

      const dataToSet = {
        ...data,
        total,
      };

      if (contributed) {
        // observacion posiblemente pasar a un array porque una persona puede contribuir mas de una vez
        dataToSet.contributed = contributed;
        dataToSet.remaining = Number((total - contributed).toFixed(2));

        if (dataToSet.remaining <= 0) {
          dataToSet.totalCancel = true;
          dataToSet.check = true;
        }
      } else {
        dataToSet.remaining = Number(total);
      }

      t.set(servicesRef, dataToSet);
      t.update(currentIdRef, {
        currentId,
      });
    });
  } catch (error) {
    console.log("ocurrio un error");
    console.log(error);
    res.send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,
    });
  }

  res.send({ message: "exito servicio añadido", isSuccess: true });
};

export default createServices;
