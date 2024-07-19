

import { dbGB } from "../../firebase/firebase.cjs";

const updateDollar = async (req, res) => {
  const data = req.body;

  try {
    await dbGB.runTransaction(async (t) => {
      const serviceRef = dbGB.collection("utils").doc("dollar");

        t.update(serviceRef,{...data});
   
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
    message: "Exito dolar actualizado",
    isSuccess: true,
  });
};

export default updateDollar;
