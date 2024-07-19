import { dbGB } from "../../firebase/firebase.cjs";
import { generateChatId } from "../../utils/uniueHasGenerator.js";

const privateChats = async (req, res) => {
  console.log("datos a enviar", req.body);
  const {
    userId,
    destination,
    message,
    displayName,
    destinationDisplayName,
    email,
    destinatioEmail,
  } = req.body;

  const time = new Date();

  const chatId = generateChatId();
  const fromRef = dbGB
    .collection("users")
    .doc(userId)
    .collection("chats")
    .doc(destination)
    .collection("messages")
    .doc(chatId);

  const toRef = dbGB
    .collection("users")
    .doc(destination)
    .collection("chats")
    .doc(userId)
    .collection("messages")
    .doc(chatId);

  const spechFromRef = dbGB
    .collection("users")
    .doc(userId)
    .collection("chats")
    .doc(destination);

  const spechToRef = dbGB
    .collection("users")
    .doc(destination)
    .collection("chats")
    .doc(userId);

  const fromMessage = {
    userId: destination,
    message,
    time,
    chatId,
  };

  const toMessage = {
    userId,
    message,
    time,
    chatId,
  };

  const fromChatData = {
    userId: destination,
    displayName: destinationDisplayName,
    email: destinatioEmail,
  };

  const toChatData = {
    userId,
    displayName,
    email,
  };

  try {
    await dbGB.runTransaction(async (t) => {
      t.set(fromRef, fromMessage);
      t.set(spechFromRef, fromChatData);
      t.set(toRef, toMessage);
      t.set(spechToRef, toChatData);
    });
  } catch (error) {
    res.send({ message: "lo siento pero ocurrio un error" });
    console.log(error);
  }

  res.send({
    message: "mesaje enviado",
  });
};

export default privateChats;
