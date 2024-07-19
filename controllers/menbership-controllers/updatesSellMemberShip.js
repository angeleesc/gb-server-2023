import { dbGB } from "../../firebase/firebase.cjs";

const updateSellMenberShip = async (req, res) => {
  const { saleid, eventId } = req.params;

  const salesRef = dbGB
    .collection("events")
    .doc(eventId)
    .collection("sales")
    .doc(saleid);

  const schema = {
    eventId: true,
    menbershipPlanID: true,
    lugarDeVenta: "Caracas",
    gifTo: true,
    metodoDePago: true,
    referenciaDePagoDePsarela: true,
    vendedor: true,
    IVA: true,
    impMunicipal: true,
    monetaryMoney: true,
    planId: true,
  };

  const dataToUpdate = {};

  for (let key in schema) {
    if (req.body[key]) dataToUpdate[key] = req.body[key];
  }

  if (req.body.planId) {
    const plantData = (await salesRef.get()).data();

    for (let keyPlan in plantData) {
      dataToUpdate[keyPlan] = plantData[keyPlan];
    }
  }

  await salesRef.update(dataToUpdate);

  res.send({
    message: "editado",
    isScucces: true,
  });
};

export default updateSellMenberShip;