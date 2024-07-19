import { dbGB, dbLV } from "../../firebase/firebase.cjs";

const createContractBuines = async (req, res) => {
    console.log('creando contrato')
  const {
    Rif,
    businessHomeAddress,
    representativeSFullName,
    brandName,
    rubro,
    representativeDocumentID,
    phone,
    email,
    type,
    businessName,
    staff,
    eventId,
    monto,
    conditions
  } = req.body;

  if (!eventId) {
    res.send({
      message: "lo siento pero el id del evento es requerido",
      isSuccess: false,
    });
    return;
  }

  if (!monto) {
    res.send({
      message: "lo siento pero monto es requerido",
      isSuccess: false,
    });
    return;
  }

  if (type === "entrepreneur" || type === "sponsor") {
    if (!staff) {
      res.send({
        message:
          "lo siento pero para los emprendedores y patrocinadores en nesesario los datos del staf de trabajo",
        isSuccess: false,
      });
      return;
    }

    if (!Array.isArray(staff)) {
      res.send({
        message:
          "lo siento pero el valor de staf es invalido debe ser un arreglo",
        isSuccess: false,
      });
    }
  }

  const businessLVRef = dbLV.collection(type).doc(Rif);
  const result = await businessLVRef.get();

  let dataToSet;

  if (result.exists) {
    console.log(result.data());
    dataToSet = { ...result.data(), staff };
  } else {
    if (!businessHomeAddress) {
      res.send({
        message:
          "lo siento pero la direcion del negocio es requerido (businessHomeAddress)",
        isSuccess: false,
      });
      return;
    }

    if (!representativeSFullName) {
      res.send({
        message:
          "lo siento pero es nesesario el nombre del representante (representativeSFullName)",
        isSuccess: false,
      });
      return;
    }

    if (!brandName) {
      res.send({
        message: "lo siento pero brand name es nesesario (brandName)",
        isSuccess: false,
      });
      return;
    }

    if (!rubro) {
      res.send({
        message: "lo siento pero rubro es requerido (rubro)",
        isSuccess: false,
      });
      return;
    }

    if (!phone) {
      res.send({
        message: "losiento pero el telefono es requerido es",
        isSuccess: false,
      });
      return;
    }

    if (!representativeDocumentID) {
      res.send({
        message:
          "lo siento pero representative document is es requerido (representativeDocumentID)",
        isSuccess: false,
      });
      return;
    }

    if (!email) {
      res.send({
        message: "lo siento pero el email es reqrido",
        isSuccess: false,
      });
      return;
    }

    if (!businessName) {
      res.send({
        message: "lo siento pero el nombre del negecio legal es requerido",
        isSuccess: false,
      });
      return;
    }

    dataToSet = {
      Rif,
      businessHomeAddress,
      representativeSFullName,
      brandName,
      rubro,
      representativeDocumentID,
      phone,
      email,
      businessName,
      staff,
      monto,
      conditions,
    };
  }

  try {
    const buissnessRef = dbGB
      .collection("events-logitict")
      .doc(eventId)
      .collection(type)
      .doc(Rif);

    await buissnessRef.set(dataToSet);

    res.send({
      message: "EXITO",
      isSuccess: true,
    });
    return;
  } catch (error) {
    console.log(error);
    res.send({ message: "FRACASO", error, isSuccess: false });
    return;
  }
};
export default createContractBuines;
