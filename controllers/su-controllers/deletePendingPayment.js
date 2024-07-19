import { dbGB } from "../../firebase/firebase.cjs";

const deletePendingPayment = async (req, res) => {
  const { id } = req.params;
const data= req.body
  const transferPending = dbGB.collection("transferPending").doc(id);


  
  
  try {
 
    await dbGB.collection("pendingTransfersDeleted").doc(id).set({...data,fecha:new Date(data.date)});


    await transferPending.delete();

    res.send({
      message: "exito eliminado",
      isSuccess: true,
    });

    return;
  } catch (error) {
    console.log(error)
    res.send({
      message: "ocurrio un error",
      isSuccess: false,
      error,
    });

    return;
  }
};

export default deletePendingPayment;
