import { Storage } from "@google-cloud/storage";
import { dbLV } from "../../firebase/firebase.cjs";
import { extname } from "path";


const createBusiness = async (req, res) => {
  const {
    Rif,
    socialNetwork,
    businessHomeAddress,
    representativeSFullName,
    brandName,
    rubro,
    representativeHomeAddress,
    representativeDocumentID,
    phone,
    email,
    type,
    businessName,
  } = req.body;

  const storage = new Storage({ keyFilename: "gcloudKey.json" });
  const bucket = storage.bucket("live-vip");

  let catalogoUrl = "";

  if (req.files && req.files.catalogo) {
    const { catalogo } = req.files;
    console.log(req.files);
    const { name: fileName, tempFilePath } = catalogo;

    try {
      await bucket.upload(tempFilePath, {
        destination: `${type}-live-vip/${Rif}/catalogo${extname(fileName)}`,
      });
      const file = bucket.file(
        `${type}-live-vip/${Rif}/catalogo${extname(fileName)}`
      );
      console.log(file.publicUrl());
      catalogoUrl = file.publicUrl();
    } catch (error) {
      console.log(error);
      return res.json({
        message: "lo siento pero ocurrio un error",
      })
    }
  }



  const businessRef = dbLV.collection(type).doc(Rif);

  const result = await businessRef.get();
  if (result.exists) {
    return res.send({
      message: "lo siento pero este negocio ya existe",
      isSuccess: false,
    });
  }

  const dataToSet = {
    Rif,
    businessHomeAddress,
    representativeSFullName,
    brandName,
    rubro,
    representativeHomeAddress,
    representativeDocumentID,
    phone,
    email,
    businessName,
  };

  if (typeof socialNetwork === "string") {
    dataToSet.socialNetwork = JSON.parse(socialNetwork);
  } else if (typeof socialNetwork === "object") {
    dataToSet.socialNetwork = socialNetwork;
  }

  console.log(catalogoUrl);

  if (catalogoUrl) dataToSet.catalogoUrl = catalogoUrl;

  await businessRef.set(dataToSet);

  res.send({
    message: "exitso negocio  agregado",
  });
};
export default createBusiness;
