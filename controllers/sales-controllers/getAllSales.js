import { db } from "../../firebase/firebase.cjs";

const getAllSales = async (req, res) => {
  const serviceRef = db.collection("events");

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatDateWithouTolocate = (item) => {
    return new Date((item?.seconds + item?.nanoseconds * 10 ** -9) * 1000);
  };

  const events = await serviceRef.get();
  if (events) {
    let allSales = [];
    let eventos = [];

    for (const sal of events.docs) {
      const id = sal.id;
      const salesRef = db
        .collection("events")
        .doc(id)
        .collection("sales")
        .orderBy("fecha", "asc");

      eventos.push({
        title: sal.data().title,
        id: sal.id,
        aforo: sal.data().aforo,
        zones: sal.data().zones ?? sal.data().zones,
        zonesArr: sal.data().zones?.map((x) => x.zone ?? x),
      });
      const sales = await salesRef.get();

      if (!sales.empty) {
        sales.forEach((e) => {
          const el = e.data();
          allSales.push({
            ...e.data(),
            fecha: formatDateWithouTolocate(
              e.data().fecha
            ).toLocaleDateString("es-ES", { timeZone: "America/Caracas" }),
            fechaDate: new Date(
              formatDateWithouTolocate(e.data().fecha).getFullYear(),
              formatDateWithouTolocate(e.data().fecha).getMonth(),
              formatDateWithouTolocate(e.data().fecha).getDate()
            ),
            fechaDates: formatDateWithouTolocate(
              e.data().fecha
            ),
            totalTicket: el.boletos?.length,
            dayDate: formatDateWithouTolocate(e.data().fecha).getDate(),
            mesDate: formatDateWithouTolocate(e.data().fecha).getMonth(),
            yearDate: formatDateWithouTolocate(e.data().fecha).getFullYear(),
            montoTotalDolares:
              el.referenciaDePago === "multipagos"
                ? (el.metodoDePago?.efectivo?.value ?? 0) +
                (el.metodoDePago?.zelle?.value ?? 0) +
                (el.metodoDePago?.binance?.value ?? 0) +
                (el.metodoDePago?.tarjetaDeCredito?.value ?? 0)
                : el.referenciaDePago === "pagoMovil" ||
                  el.referenciaDePago === "efectivoBs" ||
                  el.referenciaDePago === "puntoDeVenta" ||
                  el.referenciaDePago === "vzlaTransfer" ||
                  el.referenciaDePago === "Debito Ahorro Vnzla" ||
                  el.referenciaDePago === "Debito Corriente Vnzla" ||
                  el.referenciaDePago === "Credito Visa Vnzla" ||
                  el.referenciaDePago === "Credito Mastercard Vnzla" ||
                  el.referenciaDePago === "Monedero Patria" ||
                  el.referenciaDePagoDePsarela === "pagoMovil" ||
                  el.referenciaDePagoDePsarela === "efectivoBs" ||
                  el.referenciaDePagoDePsarela === "puntoDeVenta"
                  ? 0
                  : el.precioTotal,
            montoTotalBs:
              el.referenciaDePago === "pagoMovil" ||
                el.referenciaDePago === "efectivoBs" ||
                el.referenciaDePago === "puntoDeVenta" ||
                el.referenciaDePago === "vzlaTransfer" ||
                el.referenciaDePago === "Debito Ahorro Vnzla" ||
                el.referenciaDePago === "Debito Corriente Vnzla" ||
                el.referenciaDePago === "Credito Visa Vnzla" ||
                el.referenciaDePago === "Credito Mastercard Vnzla" ||
                el.referenciaDePago === "Monedero Patria" ||
                el.referenciaDePagoDePsarela === "pagoMovil" ||
                el.referenciaDePagoDePsarela === "efectivoBs" ||
                el.referenciaDePagoDePsarela === "puntoDeVenta"
                ? el.precioTotal * el.tasaDelDolarToBs
                : el?.referenciaDePago === "multipagos"
                  ? (el.metodoDePago?.pagoMovil?.value === undefined
                    ? 0
                    : el.metodoDePago?.pagoMovil?.value) *
                  el.tasaDelDolarToBs +
                  (el.metodoDePago?.vzlaTransfer?.value === undefined
                    ? 0
                    : el.metodoDePago?.vzlaTransfer?.value) *
                  el.tasaDelDolarToBs +
                  (el.metodoDePago?.bdv?.value === undefined
                    ? 0
                    : el.metodoDePago?.bdv?.value) *
                  el.tasaDelDolarToBs +
                  (el.metodoDePago?.puntoDeVenta?.value === undefined
                    ? 0
                    : el.metodoDePago?.puntoDeVenta?.value) *
                  el.tasaDelDolarToBs +
                  (el.metodoDePago?.efectivoBs?.value === undefined
                    ? 0
                    : el.metodoDePago?.efectivoBs?.value) *
                  el.tasaDelDolarToBs
                  : 0,
            mes: meses[formatDateWithouTolocate(e.data().fecha).getMonth()],
            month: month[formatDateWithouTolocate(e.data().fecha).getMonth()],
            monthIndex: formatDateWithouTolocate(e.data().fecha).getMonth(),
          });
        });
      }
    }

    if (allSales.length) {
      //==========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
      //
      //  #####    #####   ##      #####  ######   #####    ####        #####    #####   #####          ######   #####   ##     ##    ###     ####
      //  ##  ##  ##   ##  ##      ##       ##    ##   ##  ##           ##  ##  ##   ##  ##  ##            ##   ##   ##  ####   ##   ## ##   ##
      //  #####   ##   ##  ##      #####    ##    ##   ##   ###         #####   ##   ##  #####            ##    ##   ##  ##  ## ##  ##   ##   ###
      //  ##  ##  ##   ##  ##      ##       ##    ##   ##     ##        ##      ##   ##  ##  ##          ##     ##   ##  ##    ###  #######     ##
      //  #####    #####   ######  #####    ##     #####   ####         ##       #####   ##   ##        ######   #####   ##     ##  ##   ##  ####
      //
      //==========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

      let arrZone = allSales?.map((el) =>
        el.eventId === "eventoStreaming" ? el.planName : el?.boletos?.[0]?.zona
      );
      let zones = arrZone?.filter((e, pos) => arrZone.indexOf(e) === pos);

      const boletos = zones.map((el) => {
        const totalTicket = allSales
          .filter((ticket) =>
            ticket.eventId === "eventoStreaming"
              ? ticket.planName === el
              : ticket?.boletos?.[0].zona === el
          )
          ?.map((count) =>
            count.eventId === "eventoStreaming" ? 1 : count?.boletos?.length
          )
          ?.reduce((prev, curr) => prev + curr, 0);

        return { zona: el, total: totalTicket };
      });

      //=====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
      //
      //  #####    #####   ##      #####  ######   #####    ####        #####    #####   #####          #####  #####   ####  ##   ##    ###
      //  ##  ##  ##   ##  ##      ##       ##    ##   ##  ##           ##  ##  ##   ##  ##  ##         ##     ##     ##     ##   ##   ## ##
      //  #####   ##   ##  ##      #####    ##    ##   ##   ###         #####   ##   ##  #####          #####  #####  ##     #######  ##   ##
      //  ##  ##  ##   ##  ##      ##       ##    ##   ##     ##        ##      ##   ##  ##  ##         ##     ##     ##     ##   ##  #######
      //  #####    #####   ######  #####    ##     #####   ####         ##       #####   ##   ##        ##     #####   ####  ##   ##  ##   ##
      //
      //=====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
      let arrDate = allSales?.map((el) => el.fecha);
      let dates = arrDate?.filter((el, pos) => arrDate.indexOf(el) === pos);


      
      const ticketsForDay = dates
        ?.filter((x, pos) => dates.indexOf(x) === pos)
        ?.map((el) => {
          const totalTicketDate = allSales
            .filter((ticket) => ticket.fecha === el)
            ?.map((count) =>
              count.eventId === "eventoStreaming" ? 1 : count?.boletos?.length
            )
            ?.reduce((prev, curr) => prev + curr, 0);

          return {
            fecha: el,
            total: totalTicketDate,
            month: Number(String(el).split("/")?.[1]),
            day: Number(String(el).split("/")?.[0]),
          };
        })
        .sort((a, b) => a.month - b.month || a.day - b.day);

      const getTicketDay = () => {
        const arr = [...ticketsForDay];

        for (let index = 0; index < 30; index++) {
          if (arr.length > 30) {
            arr.splice(0, 1);
            continue;
          } else if (arr.length === 30) {
            break;
          }
        }
        return arr;
      };

      //===================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
      //
      //  ##   ##  #####  ##     ##  ######    ###     ####        #####    #####   #####          ###    ###  #####   ####
      //  ##   ##  ##     ####   ##    ##     ## ##   ##           ##  ##  ##   ##  ##  ##         ## #  # ##  ##     ##
      //  ##   ##  #####  ##  ## ##    ##    ##   ##   ###         #####   ##   ##  #####          ##  ##  ##  #####   ###
      //   ## ##   ##     ##    ###    ##    #######     ##        ##      ##   ##  ##  ##         ##      ##  ##        ##
      //    ###    #####  ##     ##    ##    ##   ##  ####         ##       #####   ##   ##        ##      ##  #####  ####
      //
      //===================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

      const salesForMonth = month?.map((el) => {
        const totalTicketDate = allSales
          .filter((ticket) => String(ticket.month).includes(el))
          ?.map((count) =>
            count.eventId === "eventoStreaming" ? 1 : count?.boletos?.length
          )
          ?.reduce((prev, curr) => prev + curr, 0);
        return {
          mes: el,
          total: totalTicketDate,
          monthIndex: month.indexOf(el),
        };
      });

      //=======================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
      //
      //  ##   ##  #####  ##     ##  ######    ###     ####        #####    #####   #####          #####  ##   ##  #####  ##     ##  ######   #####         ####    ##    ###
      //  ##   ##  ##     ####   ##    ##     ## ##   ##           ##  ##  ##   ##  ##  ##         ##     ##   ##  ##     ####   ##    ##    ##   ##        ##  ##  ##   ## ##
      //  ##   ##  #####  ##  ## ##    ##    ##   ##   ###         #####   ##   ##  #####          #####  ##   ##  #####  ##  ## ##    ##    ##   ##        ##  ##  ##  ##   ##
      //   ## ##   ##     ##    ###    ##    #######     ##        ##      ##   ##  ##  ##         ##      ## ##   ##     ##    ###    ##    ##   ##        ##  ##  ##  #######
      //    ###    #####  ##     ##    ##    ##   ##  ####         ##       #####   ##   ##        #####    ###    #####  ##     ##    ##     #####         ####    ##  ##   ##
      //
      //=======================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

      const salesEventForDay = eventos.map((eventData) => {
        const dt = dates
          ?.filter((x, pos) => dates.indexOf(x) === pos)
          ?.map((el) => {
            const totalTicketDate = allSales
              .filter(
                (ticket) =>
                  ticket.fecha === el && ticket.eventId === eventData.id
              )
              ?.map((count) =>
                count.eventId === "eventoStreaming" ? 1 : count?.boletos?.length
              )
              ?.reduce((prev, curr) => prev + curr, 0);

            return {
              fecha: el,
              total: totalTicketDate,
              month: Number(String(el).split("/")?.[1]),
              event: eventData,
            };
          })
          .sort((a, b) => a.month - b.month);
        return { data: dt, event: eventData };
      });

      //============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
      //
      //  ##   ##  #####  ##     ##  ######    ###     ####        #####    #####   #####          #####  ##   ##  #####  ##     ##  ######   #####         ###    ###  #####   ####
      //  ##   ##  ##     ####   ##    ##     ## ##   ##           ##  ##  ##   ##  ##  ##         ##     ##   ##  ##     ####   ##    ##    ##   ##        ## #  # ##  ##     ##
      //  ##   ##  #####  ##  ## ##    ##    ##   ##   ###         #####   ##   ##  #####          #####  ##   ##  #####  ##  ## ##    ##    ##   ##        ##  ##  ##  #####   ###
      //   ## ##   ##     ##    ###    ##    #######     ##        ##      ##   ##  ##  ##         ##      ## ##   ##     ##    ###    ##    ##   ##        ##      ##  ##        ##
      //    ###    #####  ##     ##    ##    ##   ##  ####         ##       #####   ##   ##        #####    ###    #####  ##     ##    ##     #####         ##      ##  #####  ####
      //
      //============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

      const salesEventForMonth = eventos.map((eventData) => {
        const dt = month?.map((el) => {
          const totalTicketDate = allSales
            .filter(
              (ticket) =>
                String(ticket.month).includes(el) &&
                ticket.eventId === eventData.id
            )
            ?.map((count) =>
              count.eventId === "eventoStreaming" ? 1 : count?.boletos?.length
            )
            ?.reduce((prev, curr) => prev + curr, 0);
          return {
            mes: el,
            total: totalTicketDate,
            monthIndex: month.indexOf(el),
            event: eventData,
          };
        });
        return { data: dt, event: eventData };
      });

      //=========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
      //
      //  ##   ##  #####  ##     ##  ######    ###     ####        #####    #####   #####          ######    ###     #####   ##   ##  ##  ##      ##        ###
      //  ##   ##  ##     ####   ##    ##     ## ##   ##           ##  ##  ##   ##  ##  ##           ##     ## ##   ##   ##  ##   ##  ##  ##      ##       ## ##
      //  ##   ##  #####  ##  ## ##    ##    ##   ##   ###         #####   ##   ##  #####            ##    ##   ##  ##   ##  ##   ##  ##  ##      ##      ##   ##
      //   ## ##   ##     ##    ###    ##    #######     ##        ##      ##   ##  ##  ##           ##    #######   #####   ##   ##  ##  ##      ##      #######
      //    ###    #####  ##     ##    ##    ##   ##  ####         ##       #####   ##   ##          ##    ##   ##  ##        #####   ##  ######  ######  ##   ##
      //
      //=========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
      const arrVendors = allSales.map((el) => el.vendedor);

      const vendors = arrVendors.filter(
        (x, pos) => arrVendors.indexOf(x) === pos
      );
      const salesForVendors = vendors?.map((el) => {
        //VENTA TOTAL
        const totalSales = allSales
          .filter((x) => x.vendedor === el)
          ?.map((z) => (z.eventId === "eventoStreaming" ? 1 : z.boletos.length))
          ?.reduce((prev, curr) => prev + curr, 0);

        //VENTA POR EVENTO
        const otherData = eventos.map((even) => {
          const salForEventAndVendor = allSales
            .filter((x) => x.vendedor === el && x.eventId === even.id)
            ?.map((z) =>
              z.eventId === "eventoStreaming" ? 1 : z.boletos.length
            )
            ?.reduce((prev, curr) => prev + curr, 0);
          return { event: even, sales: salForEventAndVendor };
        });

        return { vendor: el, sales: totalSales, otherData: otherData };
      });
      //================================================================================================================================================================================================================================================================================================================================================================================================================
      //
      //  #####    #####   ####  ##   ##  ##      ######
      //  ##  ##   ##     ##     ##   ##  ##        ##
      //  #####    #####   ###   ##   ##  ##        ##
      //  ##  ##   ##        ##  ##   ##  ##        ##
      //  ##   ##  #####  ####    #####   ######    ##
      //
      //================================================================================================================================================================================================================================================================================================================================================================================================================

      if (ticketsForDay?.length && boletos?.length && salesForVendors.length) {
        res.send({
          message: "Datos Obtenidos",
          isSuccess: true,
          sales: allSales,
          events: eventos,
          tickets: boletos,
          ticketForDay: getTicketDay(),
          meses,
          month,
          salesForMonth: salesForMonth,
          salesForVendors: salesForVendors,
          salesEventForDay,
          salesEventForMonth,
        });
      }
    }
  }
};

export default getAllSales;
