import { Router } from "express";
import deletePendingPayment from "../controllers/su-controllers/deletePendingPayment.js";
import courtesyTransaction from "../controllers/su-controllers/courtesiesTransactions.js";
import deleteCourtesiesTransaction from "../controllers/su-controllers/deleteCortesie.js";
import deleteSale from "../controllers/su-controllers/deleteSales.js";
import generalCourtesyTransaction from "../controllers/su-controllers/generalCourtesyTransaction.js";
import generalPlaceGenerator from "../controllers/su-controllers/generalPlaceGenerato.js";
import placeGenerator from "../controllers/su-controllers/placeGenerator.js";
import placeRowGenerator from "../controllers/su-controllers/placeRowGenerator.js";
import createEvent from "../controllers/su-controllers/createEvent.js";
import deleteEvent from "../controllers/su-controllers/deleteEvent.js";
import updateEvent from "../controllers/su-controllers/updateEvent.js";
import updateDollar from "../controllers/su-controllers/updateDollar.js";
import deleteZoneGeneral from "../controllers/su-controllers/deleteZoneGeneral.js";
import createPaymentProducer from "../controllers/su-controllers/createPaymentProducer.js";
import deletePaymentProducer from "../controllers/su-controllers/deletePaymentProducer.js";
import updatePaymentProducer from "../controllers/su-controllers/updatePaymentProducer.js";
import updateSale from "../controllers/su-controllers/updateSales.js";
import createSeller from "../controllers/su-controllers/createVendor.js";
import editSeller from "../controllers/su-controllers/editVendor.js";
import deleteSeller from "../controllers/su-controllers/deleteVendor.js";
import createUser from "../controllers/su-controllers/createUser.js";
import deleteUser from "../controllers/su-controllers/deleteUser.js";
import changePendingPaymentStatus from "../controllers/su-controllers/changePendingPaymentStatus.js";
import addInvoiceToDispute from "../controllers/su-controllers/addInvoiceToDispute.js";
import deleteInvoiceDispute from "../controllers/su-controllers/deleteInvoiceDispute.js";
import addClosure from "../controllers/su-controllers/addClosure.js";
import addMovement from "../controllers/su-controllers/addMovement.js";
import createTicketTemplate from "../controllers/su-controllers/createTicketTemplate.js";
import deleteTicketTemplate from "../controllers/su-controllers/deleteTicketTemplate.js";
import createArtist from "../controllers/artist-controllers/addArtist.js";
import deleteArtist from "../controllers/su-controllers/deleteArtist.js";
import editUserDashboard from "../controllers/su-controllers/editUserDashboard.js";
import createRefundSale from "../controllers/refund-controllers/refundSale.js";
import showCloseouts from "../controllers/finance-controllers/showCloseouts.js";
import editTicketTemplate from "../controllers/su-controllers/editTicketTemplate.js";

// import placeGenerator from "../controllers/su-controllers/placeGenerator.js";

const routes = Router();
routes.post("/eliminar-facturacion", deleteSale);
routes.post("/editar-facturacion", updateSale);
routes.post("/add-invoice-to-dispute", addInvoiceToDispute);
routes.post("/delete-invoice-dispute", deleteInvoiceDispute);
routes.post("/operaciones-de-cortecia-por-silla", courtesyTransaction);
routes.post("/operacion-de-cortesia-general", generalCourtesyTransaction);
routes.delete("/courtesy/:id/:eventId", deleteCourtesiesTransaction);
routes.post("/generador-de-puestos-dinamicos-mesa", placeGenerator);
routes.post("/crear-zona-de-fila-generica", placeRowGenerator);
routes.post("/general-place-generator", generalPlaceGenerator);
routes.post("/generador-de-puestos-dinamicos-fila", (req, res) => {
  const { eventId, price, priceZone, taxtData, zoneName, zona, rows } =
    req.body;
});
routes.post("/dollar/update", updateDollar)

routes.post("/pending-payment/delete/:id", deletePendingPayment);
routes.post("/pending-payment/update/changePendingPaymentStatus", changePendingPaymentStatus);


routes.post("/event/create", createEvent);

routes.post("/vendors/create-seller", createSeller);
routes.post("/vendors/edit-seller", editSeller);



routes.post("/vendors/delete-seller", deleteSeller); // req.body no es valido en el proceso Delete protocolo https (el ambiente de producion) te llegara a dar n error por eso te recomiendo parsalo por un req.query o por req.params

routes.post("/users/edit-user", editUserDashboard);

routes.post("/users/create-user", createUser); // no tiene un middelwware validador por el lado del back en preguntando si el valor es requerido 
routes.post("/users/delete-user", deleteUser);

routes.post("/refund/:eventId", createRefundSale)

routes.delete("/event/delete/:eventId", deleteEvent);
routes.delete("/zone/delete/:eventId/:idZone", deleteZoneGeneral);
routes.put("/event/update/:eventId", updateEvent);



routes.post("/paymentsProducer/create/:eventId", createPaymentProducer);
routes.delete("/paymentsProducer/delete/:eventId/:payId", deletePaymentProducer);
routes.put("/paymentsProducer/update/:eventId/:payId", updatePaymentProducer);



routes.post("/finance/add-closure/", addClosure);
routes.post("/finance/add-movement/", addMovement);
routes.post("/finance/get-closeouts/", showCloseouts);


//TICKET TEMPLATE
routes.post("/ticketTemplate/create-ticket-template/", createTicketTemplate);
routes.post("/ticketTemplate/delete-ticket-template/", deleteTicketTemplate);
routes.post("/ticketTemplate/edit-ticket-template/", editTicketTemplate);


routes.post("/artistInHero/create-artist/", createArtist);
routes.post("/artistInHero/delete-artist/", deleteArtist);




const suRoutes = routes;
export default suRoutes;
