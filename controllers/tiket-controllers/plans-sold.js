import { dbLV } from "../../firebase/firebase.cjs";
import { format } from "date-fns-tz";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import { generateUniQueEventFacturation } from "../../utils/uniueHasGenerator.js";

export const plansSold = async (req, res) => {
  const { items, ...paymentData } = req.body;
  const fecha = new Date();
  const fechaVE = utcToZonedTime(fecha, "America/Caracas");
  const serialDeFactura = generateUniQueEventFacturation();

  // obtenemos los ids de la descripcion
  const getValues = [];

  for (let item of items) {
    const p = new Promise((resolve, rejet) => {
      dbLV
        .collection("travels-items")
        .doc(item.id)
        .get()
        .then((data) => {
          if (!data.exists) throw new Error("este id no existe");
          resolve({ ...data.data(), quantity: item.quantity });
        })
        .catch((error) => {
          rejet(error);
        });
    });

    getValues.push(p);
  }

  const results = await Promise.allSettled(getValues)
    .then((values) => {
      return values.map((value) => value.value);
    })
    .catch((error) => {
      console.error(error);
    });

  //   console.log(results)

  // calculamos el total

  let total = 0;
  let blining = [];

  for (let item of results) {
    const { name, price, quantity } = item;

    const itemData = {
      name,
      price,
      quantity,
      totalItem: price * quantity,
    };

    blining.push(itemData);
    total += itemData.totalItem;

    // console.log(itemData)
  }

  //   console.log(total);

  // los guardamos en ventas
  const saleData = {
    idFactura: serialDeFactura.id,
    formarDate: format(fechaVE, "dd-LL-uuuu", { timeZone: "America/Caracas" }),
    formatTime: format(fechaVE, "HH:mm:ss", { timeZone: "America/Caracas" }),
    fecha,
    blining,
    ...paymentData,
    total,
    saleTag: serialDeFactura,
  };

  //   console.log(saleData);

  await dbLV.collection("global-sales").doc(serialDeFactura.id).set(saleData);

  res.send({
    message: "exito XD plan vendido",
  });
};
