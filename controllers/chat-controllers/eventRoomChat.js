import  { dbGB } from '../../firebase/firebase.cjs';
import { generateChatId } from '../../utils/uniueHasGenerator.js';


const evenRoonChat = async (req, res) => {
    const { eventId } = req.body;
  
    console.log("body modificado", req.body);
  
    const chatId = generateChatId();
    const eventRomRef = dbGB
      .collection("events")
      .doc(eventId)
      .collection("message")
      .doc(chatId);
    const time = new Date();
  
    const schema = {
      userId: true,
      avatar: true,
      message: true,
      displayName: true,
    };
  
    const dataToSet = {};
  
    for (let schemaKey in schema)
      if (req.body[schemaKey]) dataToSet[schemaKey] = req.body[schemaKey];
  
    await eventRomRef.set({ ...dataToSet, time });
    console.log(chatId);

    res.send({ message: "mensaje enviado", time });
  }

  export default evenRoonChat;