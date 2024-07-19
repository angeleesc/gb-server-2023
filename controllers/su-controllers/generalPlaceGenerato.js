import { db } from "../../firebase/firebase.cjs";

const generalPlaceGenerator = async (req, res) => {
  const { cantidad, taxtData, tiketName, zona, start, eventId } = req.body;

  const validSchema = {
    cantidad: {
      type: "string",
      message: "lo siento pero cantidad es requerida",
    },
    taxtData: {
      type: "objet",
      message: "lo siento pero taxtdata es requerida",
    },
    tiketName:{
      type:'string',
      message: "lo siento pero tiketNmae es requerido"
    },
    zona:{
      type: "string",
      message: "lo siento pero zona es requerida"
    },
    start:{
      type: "string",
      message: "lo siento pero el numero de inicio es requerido"
    },
    eventId:{
      type:"string",
      message: "lo siento pero el id del evento es requerido"
    }
  };

  const errosSchema = {};

  for (let validKey in validSchema) {
    if (!req.body[validKey]) {
      errosSchema[validKey] = validSchema[validKey].message;
    }
  }

  if (Object.keys(errosSchema).length > 0) {
    res.send({
      message: "losiento pero ocurion un error",
      isSuccess: false,
      error: errosSchema,
    });
    return
  }

  console.log(errosSchema);

  console.log("creando tiket generales")

  const iterable = Math.floor(cantidad / 200);
  const residuo = cantidad % 200;

  let id = start;

  for (let i = 1; i <= iterable; i++) {
    const tiketBatch = db.batch();
    console.log("lote ", id, "---", id + 200);

    for (let j = 1; j <= 200; j++) {
      id += 1;
      const ticketId = zona + "-" + id;
      const ticketData = {
        ...taxtData,
        tiketName: tiketName + " " + id,
        ticketId,
        estado: "ok",
        zona,
      };

      const genralRef = db
        .collection("events")
        .doc(eventId)
        .collection("general-place")
        .doc(ticketId);

      tiketBatch.set(genralRef, ticketData);
    }

    try {
    await tiketBatch.commit();
      
    } catch (error) {
      console.log('ocurrio un error')
    }
  }

  if (residuo > 0) {
    const tiketBatch = db.batch();
    console.log("lote ", id, " -- ", id + residuo);

    for (let k = 1; k <= residuo; k++) {
      id += 1;

      const ticketId = zona + "-" + id;
      const ticketData = {
        ...taxtData,
        tiketName: tiketName + " " + ticketId,
        ticketId,
        estado: "ok",
        zona,
      };

      const genralRef = db
        .collection("events")
        .doc(eventId)
        .collection("general-place")
        .doc(ticketId);

      tiketBatch.set(genralRef, ticketData);
    }


    try {
    await tiketBatch.commit();
      
    } catch (error) {
      console.log('ocurrio un error')
    }
    

  }

  res.send({ message: "entrada general creada" });
};

export default generalPlaceGenerator;
