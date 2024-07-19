import { db } from "../../firebase/firebase.cjs";

const getAllSalesEvents = async (req, res) => {
    const serviceRef = db.collection("events");

    const { idEvents, chargeLockerServiceIn, dateToFilter } = req.body;

    console.log("EJECUTANDO EL REPORTE A PRODUCTOR")


    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const clock = dateToFilter ? new Date(dateToFilter) : new Date();
    const monthToFilter = clock.getMonth();
    const dayToFilter = clock.getDate();

    const formatReportDate = dateToFilter ? `${months[monthToFilter]} ${dayToFilter}` : false


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
        let arrCourtesy = []

        for (const sal of events.docs) {
            const id = sal.id;
            if (idEvents.some(x => x === id)) {
                const salesRef = formatReportDate ? db.collection("events")
                    .doc(id)
                    .collection("sales")
                    .where("formatFacturationDate", "==", formatReportDate)
                    // .orderBy("fecha", "asc")
                    : db.collection("events")
                        .doc(id)
                        .collection("sales")
                        .orderBy("fecha", "desc")

                const courtesyRef = db
                    .collection("events")
                    .doc(id)
                    .collection("courtesy-transaction")

                const courtesyRegisters = await courtesyRef.get()

                if (!courtesyRegisters.empty) {
                    courtesyRegisters.forEach((xc) => {
                        const el = xc.data();
                        const id = xc.id
                        arrCourtesy.push({ ...el, id: id })
                    })
                }

                eventos.push({
                    title: sal.data().title,
                    id: sal.id,
                    aforo: sal.data().aforo,
                    allCortesies: [],
                    zones: sal.data().zones ?? sal.data().zones,
                    zonesArr: sal.data().zones?.map((x) => x.zone ?? x),
                });

                const sales = await salesRef.get();

                if (!sales.empty) {
                    sales.forEach((e) => {
                        const el = e.data();
                        const date = formatDateWithouTolocate(
                            e.data().fecha
                        ).toLocaleDateString("en-GB", { timeZone: "America/Caracas" })
                        allSales.push({
                            ...e.data(),
                            fecha: date,
                            fechaDate: new Date(
                                formatDateWithouTolocate(e.data().fecha).getFullYear(),
                                formatDateWithouTolocate(e.data().fecha).getMonth(),
                                formatDateWithouTolocate(e.data().fecha).getDate()
                            ),
                            fechaStr: e.data().fecha.toDate(),
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
                } else {
                    console.log("ARREGLO DE VENTAS VACIO")
                }
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

            const boletosPorCortesia = zones.map((el) => {
                const totalTicket = arrCourtesy
                    .filter((ticket) =>
                        ticket.eventId === "eventoStreaming"
                            ? ticket.planName === el
                            : ticket?.tickets?.[0].zona === el
                    )
                    ?.map((count) =>
                        count.eventId === "eventoStreaming" ? 1 : count?.tickets?.length
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



            function getTotals({ arr }) {


                const arrLockerServiceIn = chargeLockerServiceIn ? chargeLockerServiceIn : []

                const metodoDePagoBs = [
                    {
                        name: "Punto de venta",
                        key: "puntoDeVenta"
                    },
                    {
                        name: "Pago movil",
                        key: "pagoMovil"
                    },
                    {
                        name: "Debito Ahorro Vnzla",
                        key: "Debito Ahorro Vnzla"
                    },
                    {
                        name: "Debito Corriente Vnzla",
                        key: "Debito Corriente Vnzla"
                    },
                    {
                        name: "Transferencia Vnzla",
                        key: "vzlaTransfer"
                    },
                    {
                        name: "Credito mastercard Vnzla",
                        key: "Credito Mastercard Vnzla"
                    },
                    {
                        name: "Credito visa Vnzla",
                        key: "Credito Visa Vnzla"
                    },

                    {
                        name: "Monedero patria",
                        key: "Monedero Patria"
                    },
                    {
                        name: "Efectivo Bs",
                        key: "efectivoBs"
                    }
                ]

                const metodoBs = metodoDePagoBs?.map((x) => x.key);

                const arrmetodoDollars = [
                    "binance",
                    "zelle",
                    "zinli",
                    "efectivo",
                    "reserve",
                    "tarjetaDeCredito"
                ];

                const arrBs = [];
                const arrDollars = [];
                const arrDollarsProductor = [];
                const arrBsProductor = [];
                const arrDollarsGlobalboletos = [];
                const arrBsGlobalboletos = [];
                const dolaresPorCredito = []



                arr.forEach((x) => {


                    const chargeBoxOfficeService = chargeLockerServiceIn ? arrLockerServiceIn.some(y => y === x.vendedor) : true


                    const serviceOfficeBoxUni = chargeBoxOfficeService ? Number(
                        x.bill.generalPlace
                            ? x.bill.generalPlace.servicioTaquillaUnitario
                            : x.bill.vipPlaces.servicioTaquillaUnitario
                    ) : 0

                    const isBs = metodoBs.some((z) => z === x.referenciaDePago);

                    if (x.referenciaDePago === "multipagos") {
                        const amountBsInBs = [];
                        const amountDollarsInBs = [];

                        metodoBs.forEach((y) => {
                            const values = x.metodoDePago;
                            if (values[y]) {
                                if (values[y].value > 0) {
                                    arrBs.push(values[y].value * x.tasaDelDolarToBs);
                                    amountBsInBs.push(values[y].value);
                                }
                            }
                        });

                        arrmetodoDollars.forEach((y) => {
                            const values = x.metodoDePago;
                            if (values[y]) {
                                if (values[y].value > 0) {
                                    arrDollars.push(values[y].value);
                                    amountDollarsInBs.push(values[y].value);
                                }
                            }
                        });

                        const amountTotalBsInMultipayment = amountBsInBs.reduce(
                            (prev, curr) => prev + curr,
                            0
                        );
                        const amountTotalDollarInMultipayment = amountDollarsInBs.reduce(
                            (prev, curr) => prev + curr,
                            0
                        );

                        const whereMoreAmount =
                            amountTotalBsInMultipayment > amountTotalDollarInMultipayment
                                ? "Bolivares"
                                : "Dolares";


                        const serviceOfficeBoxTotal = serviceOfficeBoxUni * x.boletos.length;

                        if (amountTotalDollarInMultipayment > serviceOfficeBoxTotal) {

                            arrDollarsProductor.push(
                                amountTotalDollarInMultipayment -
                                serviceOfficeBoxUni * x.boletos.length
                            );
                            arrBsProductor.push(x.tasaDelDolarToBs * amountTotalBsInMultipayment);
                            arrDollarsGlobalboletos.push(serviceOfficeBoxUni * x.boletos.length);

                        } else {

                            if (whereMoreAmount === "Dolares") {
                                arrDollarsProductor.push(
                                    amountTotalDollarInMultipayment -
                                    serviceOfficeBoxUni * x.boletos.length
                                );
                                arrBsProductor.push(x.tasaDelDolarToBs * amountTotalBsInMultipayment);
                                arrDollarsGlobalboletos.push(serviceOfficeBoxUni * x.boletos.length);
                            } else if (whereMoreAmount === "Bolivares") {
                                arrBsProductor.push(
                                    x.tasaDelDolarToBs *
                                    (amountTotalBsInMultipayment -
                                        serviceOfficeBoxUni * x.boletos.length)
                                );
                                arrDollarsProductor.push(amountTotalDollarInMultipayment);
                                arrBsGlobalboletos.push(
                                    x.tasaDelDolarToBs * (serviceOfficeBoxUni * x.boletos.length)
                                );
                            }


                        }


                    } else if (isBs) {
                        const thereIsADiscount = x.discountedAmount ? x.discountedAmount : 0
                        const totalAmountInOperation = x.precioTotal - parseFloat(thereIsADiscount)
                        arrBs.push(totalAmountInOperation * x.tasaDelDolarToBs);
                        arrBsProductor.push(
                            x.tasaDelDolarToBs *
                            (totalAmountInOperation - serviceOfficeBoxUni * x.boletos.length)
                        );
                        arrBsGlobalboletos.push(
                            x.tasaDelDolarToBs * (serviceOfficeBoxUni * x.boletos.length)
                        );
                    } else {
                        const thereIsADiscount = x.discountedAmount ? x.discountedAmount : 0
                        const totalAmountInOperation = x.precioTotal - parseFloat(thereIsADiscount)

                        if (x.referenciaDePago === "tarjetaDeCredito") { dolaresPorCredito.push(totalAmountInOperation) }
                        arrDollars.push(totalAmountInOperation);
                        arrDollarsProductor.push(
                            totalAmountInOperation - serviceOfficeBoxUni * x.boletos.length
                        );
                        arrDollarsGlobalboletos.push(serviceOfficeBoxUni * x.boletos.length);
                    }
                });


                const totalTickets = arr.map(el => el.boletos.length).reduce((prev, curr) => prev + curr, 0);

                const totaDollarsProductor = arrDollarsProductor.reduce(
                    (prev, curr) => prev + curr,
                    0
                );
                const totaBsProductor = arrBsProductor.reduce(
                    (prev, curr) => prev + curr,
                    0
                );
                const totaDollarsGlobalboletos = arrDollarsGlobalboletos.reduce(
                    (prev, curr) => prev + curr,
                    0
                );
                const totaBsGlobalboletos = arrBsGlobalboletos.reduce(
                    (prev, curr) => prev + curr,
                    0
                );
                const totalDolaresPorTarjetaDeCredito = dolaresPorCredito.reduce(
                    (prev, curr) => prev + curr,
                    0
                );

                const totaDollars = arrDollars.reduce((prev, curr) => prev + curr, 0);
                const totalBs = arrBs.reduce((prev, curr) => prev + curr, 0);
                const totalBankCommissionBs = totalBs * 0.02
                const totalBankCommissionDollars = totalDolaresPorTarjetaDeCredito * 0.01

                return {
                    totalDolares: totaDollars,
                    totalBs: totalBs,
                    totalTickets: totalTickets,
                    totalComisionBancaria: totalBankCommissionBs,
                    totalComisionBancariaDolares: totalBankCommissionDollars,
                    totalDolaresProductor: totaDollarsProductor - totalBankCommissionDollars,
                    totalBolivaresProductor: totaBsProductor - totalBankCommissionBs,
                    totalDolaresGlobalboletos: totaDollarsGlobalboletos,
                    totalBolivaresGlobalboletos: totaBsGlobalboletos,
                }
            }


            const last30Sales = () => {
                const arr = []
                for (let index = 0; index < 20; index++) {
                    if (allSales[index]) arr.push(allSales[index])
                }
                return arr
            }


            if (ticketsForDay?.length && boletos?.length && salesForVendors.length) {
                res.send({
                    message: "Datos Obtenidos",
                    isSuccess: true,
                    getTotals: getTotals({ arr: allSales }),
                    sales: [],
                    events: eventos,
                    operations: allSales.length,
                    tickets: boletos,
                    ticketsForCourtesy: boletosPorCortesia,
                    ticketForDay: getTicketDay(),
                    meses,
                    last30Sales: last30Sales(),
                    month,
                    salesForMonth: salesForMonth,
                    salesForVendors: salesForVendors,
                    salesEventForDay,
                    arrCourtesy: arrCourtesy,
                    salesEventForMonth,
                });
            }
        } else {
            res.send({
                message: "Datos Obtenidos",
                isSuccess: true,
                getTotals: {
                    totalDolares: 0,
                    totalBs: 0,
                    totalTickets: 0,
                    totalComisionBancaria: 0,
                    totalComisionBancariaDolares: 0,
                    totalDolaresProductor: 0,
                    totalBolivaresProductor: 0,
                    totalDolaresGlobalboletos: 0,
                    totalBolivaresGlobalboletos: 0,
                },
                sales: [],
                events: [],
                operations: 0,
                tickets: [],
                ticketsForCourtesy: [],
                ticketForDay: [],
                last30Sales: [],
                meses: [],
                month: [],
                salesForMonth: [],
                arrCourtesy: [],
                salesForVendors: [],
                salesEventForDay: [],
                salesEventForMonth: [],
            });
        }
    }
};

export default getAllSalesEvents;


