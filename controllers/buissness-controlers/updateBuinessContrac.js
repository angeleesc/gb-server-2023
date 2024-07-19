import { dbGB } from "../../firebase/firebase.cjs";

const updateBiunesContract = async (req, res) => {
  const { body, params } = req;
  const { type, Rif, eventId } = params;
  const buissnesToUpdateREf = dbGB
    .collection("events-logitict")
    .doc(eventId)
    .collection(type)
    .doc(Rif);

  const buinesContractSchema = {
    representativeSFullName: true,
    businessHomeAddress: true,
    brandName: true,
    rubro: true,
    representativeDocumentID: true,
    phone: true,
    email: true,
    businessName: true,
    monto: true,
    staff: true,
    conditions: true
  };

  const dataToUpdate = {};

  for (let key in body) {
    if (buinesContractSchema[key]) {
      dataToUpdate[key] = body[key];
    }
  }

  console.table(dataToUpdate);

  try {
    await buissnesToUpdateREf.update(dataToUpdate);
    res.send({ message: "datos actualizado", isSucces: true });
    return;
  } catch (error) {
    res.send({ message: "ocurrio un error", isSucces: false, error });
  }
};

export default updateBiunesContract;
