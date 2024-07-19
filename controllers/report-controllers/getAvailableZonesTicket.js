import { db } from "../../firebase/firebase.cjs";

const getAvailableZonesTicket = async (req, res) => {
    const {eventId} =req.params
  const serviceRef = db.collection("events").doc(eventId);

  let availables = [];

  const events = await serviceRef.get();
  if (events) {
    const sal = events.data()
      const id = events.id;
      const salesRef = db.collection("events").doc(id).collection("sales");
      const zones = sal?.zones;

   
    


      const sales = await salesRef.get();

      if (!sales.empty) {
        const salesData = sales.docs.map((el) => el.data());
     

        zones?.map(async(el) => {
            const cortesyRef = db
          .collection("events")
          .doc(eventId)
          .collection("courtesy-tickets").where("zona","==",el?.zone);
          const generalPlaceRef = db
          .collection("events")
          .doc(eventId)
          .collection("general-place").where("zona","==",el?.zone);

          const generalPlaceEvent = await generalPlaceRef.get();
          const cortesy = await cortesyRef.get();
          
          if(!cortesy.empty&&!generalPlaceEvent.empty){

              
              //DATA DE LAS REF
              const generalPlaceEventData = generalPlaceEvent.docs.map((el) =>el.data());
          const cortesyData = cortesy.docs.map((el) => el.data());

          
          //Cantidad de cortesia de la zona
          const filterCortesiesWithZone = cortesyData?.length
          
          //FILTRAR GENERAL PLACE POR ZONA
          const filterGeneralPlaceWithZone = generalPlaceEventData?.filter(
            (x) => x.estado==='reserved'
          )?.length;

          //FILTRAR VENTAS POR ZONA
          const filterSalesWithZone = salesData
            ?.filter((el) => el?.boletos?.[0]?.zona === el.zone)
            ?.map((el) => el.boletos.length)
            ?.reduce((prev, curr) => prev + curr, 0);
        //TOTAL DE BOLETOS DISPONIBLES
          const availablesTicket =el.aforo - (filterCortesiesWithZone +filterGeneralPlaceWithZone +filterSalesWithZone);
          availables.push({
            event: id,
            zone: el.zone,
            availables: availablesTicket,
            process: filterGeneralPlaceWithZone,
            courtesies: filterCortesiesWithZone,
            aforo: el.aforo,
          });
        }
        });
    }
    
    if(availables?.length){
        res.send({
            message: "Datos Obtenidos",
            isSuccess: true,
            data:availables
        })
    }
  }
};

export default getAvailableZonesTicket;
