import { Router } from "express";
import ticketSold from "../controllers/tiket-controllers/tickersSold.js";
import recervedGeneralPlace from "../controllers/tiket-controllers/recerveGeneralTiket.js";
import cancelGeneralRecerve from "../controllers/tiket-controllers/cancelGeneralRecerve.js";
import getTiketRcerved from "../controllers/tiket-controllers/getTiketRecerved.js";
import cancelRecerved from "../controllers/tiket-controllers/cancelRecerved.js";
import payTickets from "../middleware/payTiket.js";
import generalRecerveValidator from "../validator/tikets-validators/generalRecerveValidator.js";
import calTotalSales from "../controllers/places-controllers/calTotalSale.js";
import { format } from "date-fns";
import sellValidator from "../validator/sell-data-validator.js/sellValidator.js";
import changeStatusToPrinted from "../controllers/tiket-controllers/changeStatusToPrinted.js";
import { plansSold } from "../controllers/tiket-controllers/plans-sold.js";
import { TiketValidator } from "../validator/TikertValidator.js";


const routes = Router();

routes.post(
  "/recerve-general-tiket",
  ...generalRecerveValidator,
  recervedGeneralPlace
);
routes.post("/cancel-general-place", cancelGeneralRecerve);
routes.post("/get-tickets-recerved", getTiketRcerved);
routes.post("/cancel-recerved", cancelRecerved);
routes.post("/change-status-to-printed", changeStatusToPrinted);
routes.post("/tickets-sold", ...sellValidator , TiketValidator,
// validacion de los montos y campos 
// checkear el metodo de pago
  // si es un metodo que requiere comprobacion humana pasamos a pagos pendiente 
  // enumeracion del id (nano is report-fecha-hora-numero-ramdom 10 digitos)
  // de reporte a tiketsold
  // si es un pago automatizado 

ticketSold);

routes.post("/plans-sold", plansSold);

routes.post("/to-sell-xd", payTickets, async (req, res) => {
  console.log(req.body);
  const {
    eventId,
    placeRecerve,
    generalPlaceRecerved,
    tablePlace,
    tablesRecerver,
    fecha: dateFrom,
    userId,
    cantidad,
    zona,
    lugarDeVenta,
    metodoDePago,
    vendedor,
    referenciaDePagoDePsarela,
    DatosDelComprador,
  } = req.body;

  const fecha = dateFrom ? new Date(dateFrom) : new Date();
  const formatFacturationDate = format(fecha, 'yyyy')
  // 1. calculamos el total

  let places = [];
  if (generalPlaceRecerved && Array.isArray(generalPlaceRecerved))
    places = [...places, ...generalPlaceRecerved];
  if (placeRecerve && Array.isArray(placeRecerve))
    places = [...places, placeRecerve];
  if (tablesRecerver && Array.isArray(tablePlace))
    places = [...places, tablePlace];

  // 1. calculamos el total de las entradas

  const billData = calTotalSales([...placeRecerve]);
  console.log("total de venta", billData);

  // 1. bloquemos los boletos y entrada segun el tipo si es silla mesa o puesto de pie XD
  // 3. registramos la venta

  console.log("vendido");
  res.send({
    message: "vendido",
  });
});


export default routes;
