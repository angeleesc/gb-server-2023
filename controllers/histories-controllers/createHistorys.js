import { format } from "date-fns";
import { customAlphabet } from "nanoid";
import { extname } from "path";
import { dbGB } from "../../firebase/firebase.cjs";
import { Storage } from "@google-cloud/storage";


const createHistory = async (req, res) => {
  const nanoid = customAlphabet("1234567890ABCDEF", 10);

  console.log(req.body);

  const ramdomId1 = nanoid(5);
  const ramdomId2 = nanoid(5);

  const { eventId, userId, userName, photoURL } = req.body;
  const { history } = req.files;
  const storage = new Storage({ keyFilename: "gcloudKey.json" });
  const bucket = storage.bucket("histories");

  let url = "";

  const { name: fileName, tempFilePath } = history;

  const timeId = new Date();

  const fecha = format(timeId, "uuuu-LL-dd");
  const dateId = format(timeId, "y-MM-dd-HH-mm-ss-");

  try {
    await bucket.upload(tempFilePath, {
      destination: `${eventId}/${fecha}/${dateId}-${ramdomId1}-${
        ramdomId2 + extname(fileName)
      }`,
    });

    const file = bucket.file(
      `${eventId}/${fecha}/${dateId}-${ramdomId1}-${
        ramdomId2 + extname(fileName)
      }`
    );

    url = file.publicUrl();
    console.log(url);

    const eventHistoryData = {
      url,
      dnsUrl: `http://34.160.130.75/${eventId}/${fecha}/${dateId}-${ramdomId1}-${
        ramdomId2 + extname(fileName)
      }`,
      time: timeId,
      userId,
      rawUrl: `${eventId}/${fecha}/${dateId}-${ramdomId1}-${
        ramdomId2 + extname(fileName)
      }`,
      
    };

    if (userName) eventHistoryData.userName = userName;
    if (photoURL) eventHistoryData.photoURL = photoURL;

    const userPersonalPhoHistoriesRef = dbGB
      .collection("users")
      .doc(userId)
      .collection("hisoriesState")
      .doc(`${dateId}-${ramdomId1}-${ramdomId2}`);

    const eventsHistoryStateRef = dbGB
      .collection("events")
      .doc(eventId)
      .collection("hisoriesState")
      .doc(`${dateId}-${ramdomId1}-${ramdomId2}`);

    const historyBath = dbGB.batch();

    historyBath.set(userPersonalPhoHistoriesRef, eventHistoryData);
    historyBath.set(eventsHistoryStateRef, eventHistoryData);

    await historyBath.commit();
  } catch (error) {
    console.log(error);
    console.log("ocurrion un error");
  }

  //   console.log(req.files);

  res.send({
    message: "historia subina",
    isSuccess: true,
  });
};

export default createHistory;
