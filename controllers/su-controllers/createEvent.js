import { db } from "../../firebase/firebase.cjs";

const createEvent = async (req, res) => {
  const  {...data} = req.body;
  try {
    await db.runTransaction(async (t) => {
      const refdb = db.collection("events").doc(data?.event); 
      const {date,startOfSale, ...newData} = data
      
      t.set(refdb,{date:new Date(data?.date), startOfSale: new Date(data?.startOfSale),...newData});
    });
  } catch (err) {
    console.log("ocurrio un error");
    console.log(err);
    res.send({
      message: "lo siento pero ocurrio un error",
      isSuccess: false,
    });
  }
  res.send({ message: "exito servicio añadido", isSuccess: true });
};
export default createEvent;
