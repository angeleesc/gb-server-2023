import { dbLV } from "../../firebase/firebase.cjs";


const createPoll = async (req, res) => {
  const {
    user,
    email,
    firstArtis,
    secondArtis
  } = req.body;

try{

    const businessLVRef = dbLV.collection("Polls");
    
    await businessLVRef.add({user:user??"ANONIMO",email:email??"ANONIMO",firstArtis,secondArtis});
    
    
     res.send({
        isSuccess: true,
        message: "Exito encuesta finalizada",
    });
}catch(err){
    console.log(err)
     res.send({
        isSuccess: false,
        message: "Error en peticion",
    })
}
};
export default createPoll;
