import { db } from "../../firebase/firebase.cjs";

const showCloseouts = async (req, res) => {
    const serviceRef = db.collection("events");

    "finance", "movements", "movements"

    const { dateToFilter } = req.body;

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

    // const formatReportDate = dateToFilter ? `${months[monthToFilter]} ${dayToFilter}` : false
    const formatReportDate = false

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

    const parseM = (method) => {
        switch (method) {
            case "transferenciaBancaAmiga":
                return "Banca-Amiga"
            case "transferenciaBancoPlaza":
                return "Banco-Plaza"
            case "transferenciaBancoVenezuela":
                return "Banco-Venezuela"
            case "pagoMovilBancaAmiga":
                return "Banca-Amiga"
            case "pagoMovilBancoPlaza":
                return "Banco-Plaza"
            case "pagoMovilBancoVenezuela":
                return "Banco-Venezuela"
            default:
                return method
        }
    }

    const methodsInBs = [
        "transferenciaBancaAmiga",
        "transferenciaBancoPlaza",
        "transferenciaBancoVenezuela",
        "pagoMovilBancaAmiga",
        "pagoMovilBancoPlaza",
        "pagoMovilBancoVenezuela",
        "efectivoBs",
        "transferencia"
    ]

    const parsedMethodsInBs = [
        "Banca-Amiga",
        "Banco-Plaza",
        "Banco-Venezuela",
        "efectivoBs",
        "transferencia"
    ]

    const events = await serviceRef.get();

    const formatDateWithouTolocate = (item) => {
        return new Date((item?.seconds + item?.nanoseconds * 10 ** -9) * 1000);
    };

    const closeoutsArr = []
    const eventsId = []
    if (events) {
        for (const sal of events.docs) {
            const id = sal.id;
            const closeoutsRef = formatReportDate ? db.collection("events")
                .doc(id)
                .collection("payments-producer")
                .where("paymentDate", "==", formatReportDate)
                : db.collection("events")
                    .doc(id)
                    .collection("payments-producer")

            const closeouts = await closeoutsRef.get();
            if (!closeouts.empty) {

                closeouts.forEach((e) => {
                    const el = e.data();
                    const operationInBs = methodsInBs.some(y => y === el.meansOfPayment)
                    const dateInOperation = formatDateWithouTolocate(el.paymentDate).toLocaleDateString("es-ES", { timeZone: "America/Caracas" })
                    const grossDate = formatDateWithouTolocate(el.paymentDate)
                    closeoutsArr.push({
                        ...el,
                        evento: id,
                        numeroDeMovimiento: e.id,
                        banco: parseM(el.meansOfPayment),
                        egresoDolares: operationInBs ? 0 : el.monto,
                        egresoBolivares: operationInBs ? el.monto : 0,
                        fecha: dateInOperation ? dateInOperation : new Date().toLocaleDateString("es-ES", { timeZone: "America/Caracas" }),
                        grossDate: grossDate
                    })
                })
                eventsId.push({ id: id, cantidadDeOperaciones: closeoutsArr.filter(w => w.evento === id).length })
            } else {
                console.log("ARREGLO DE PAGOS A PRODUCTOR VACIO")
            }
        }
    }

    const movimentsRef = db.collection("finance")
        .doc("movements")
        .collection("movements")

    const moviments = await movimentsRef.get();
    if (!moviments.empty) {
        moviments.forEach((e) => {
            const el = e.data();
            const operationInBs = parsedMethodsInBs.some(y => y === el.typePayment)
            const dateInOperation = formatDateWithouTolocate(el.createdAt).toLocaleDateString("es-ES", { timeZone: "America/Caracas" })
            const grossDate = formatDateWithouTolocate(el.createdAt)
            closeoutsArr.push({
                ...el,
                evento: "MOVIMIENTO",
                numeroDeMovimiento: e.id,
                banco: parseM(el.typePayment),
                egresoDolares: operationInBs ? 0 : el.amount,
                egresoBolivares: operationInBs ? el.amount : 0,
                descripcion: el.description,
                fecha: dateInOperation ? dateInOperation : new Date().toLocaleDateString("es-ES", { timeZone: "America/Caracas" }),
                grossDate: grossDate
            })
        })
    } else {
        console.log("ARREGLO DE MOVIMIENTOS DE RETIRO VACIO")
    }


    res.send({
        message: "Datos Obtenidos",
        closeoutsArr: closeoutsArr,
        eventsId: eventsId
    });
};

export default showCloseouts;


