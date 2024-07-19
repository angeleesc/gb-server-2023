import { dbGB } from "../../firebase/firebase.cjs";


const whiteList =  async (req, res) => {
    const userSchema = {
      // userName: true,
      email: true,
      phone: true,
      instagram: true,
      firtName: true,
      lastName: true,
      twitter:true,
      ip: true,
      city: true,
      
    };
  
    const { eventId, email } = req.body;
  
    const whiteListRef = dbGB
      .collection("events")
      .doc(eventId)
      .collection("white-list")
      .doc(email);
  
    const userData = {};
  
    for (let keyUser in req.body) {
      if (userSchema[keyUser]) userData[keyUser] = req.body[keyUser];
    }

    userData.createAt = new Date();
    userData.isVerified= false;
  
    await whiteListRef.set(userData);
    console.log(userData);
  
    res.send({
      message: "usuario irrepetipble agregado",
    });
  }
  
  export default whiteList