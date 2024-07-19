export default async function clientUpdatePlaceListener(socket, doc) {

  socket.on("client-update-place", async (data, i, key) => {
    const docData = await doc.get();
    const placeMap = docData.data();
    const placeData = docData.data()[key].places[i];
    if (placeData.status === "ok") {
      placeMap[key].places[i] = {
        ...placeData,
        status: "reserved",
        socketId: socket.id,
      };

      await doc.update({
        [key]: {
          ...placeMap[key],
          places: placeMap[key].places,
        },
      });

      socket.emit("server-place-recerved", placeMap[key].places[i]);
    } else if (placeData.status === "reserved") {
      console.log("id del dueño del campo", placeData.socketId);
      console.log("id del soecket que quiere eliminarlo", socket.id);
      
      if (placeData.socketId === socket.id) {
          console.log("el es dueño de la orden");
          placeMap[key].places[i] = {
              place:placeData.place,
              status: "ok",
            //   socketId:FieldValue.delete()
            };
            await doc.update({
                [key]: {
                    ...placeMap[key],
                    places: placeMap[key].places,
                },
            });
            socket.emit('server-place-quit', placeMap[key].places[i], key);
        } else {
        console.log("el no es el dueño de la orden");
      }
    }
    console.log(data, i, key);
  });
}
