import { db } from "../firebase/firebase.cjs";
export const getCurrentePlceListener = async (socket)=>{

    socket.on("client-get-currentplace", (data) => {
        const placeRef = db
          .collection("events-logistics")
          .doc("omar-geles")
          .collection("places")
          .doc("pelabola-place");
        dataBaelistener = placeRef.onSnapshot((doc) => {
          console.log('doc');
          socket.emit("server-get-current-places", doc.data());
        });
        console.log(data);
      });
    

}