import { dbGB } from "../../firebase/firebase.cjs";

const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const data = req.body;

  try {
    await dbGB.runTransaction(async (t) => {
      const serviceRef = dbGB.collection("events").doc(eventId);

      const result = await t.get(serviceRef);

      if (result.exists) {
//        const dataToUpdate = { ...data };
        const {date,startOfSale,...dataToUpdate}=data
        
        t.update(serviceRef, {date:new Date(data?.date), startOfSale: new Date(data?.startOfSale),...dataToUpdate});
      }else{
        console.log('no hay nada')
      }
    });
  } catch (error) {
    res.send({
      message: "ocurrio un error",
      isSuccess: false,
      error,
    });

    return;
  }
  res.send({
    message: "Exito evento actualizado",
    isSuccess: true,
  });
};

export default updateEvent;
