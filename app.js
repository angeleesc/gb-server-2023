import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import cheoutRoutes from "./routes/checkout.routes.js";
import userRoutes from "./routes/user.routes.js";
import tickersRoutes from "./routes/tiker.routes.js";
import pagoMovilReport from "./routes/pagoMovil.routes.js";
import placeSuRoutes from "./routes/place.routes.js";
import suRoutes from "./routes/su.routes.js";
import suValidator from "./middleware/suValidator.js";
import emailRoutes from "./routes/rmail.routes.js";
import preventDesaster from "./middleware/preventDesater.js";
import servicesRoutes from "./routes/services.routes.js";
import entrepreneurRoute from "./routes/consesiones.routes.js";
import reportRoute from "./routes/report.routes.js";
import packageRoutes from "./routes/packages.routes.js";
import queueRoutes from "./routes/queue.routes.js";
import streamingMenbersRoutes from "./routes/membership.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import validatechat from "./validator/chat-validator/chatValidator.js";
import historiesRoutes from "./routes/histories.routes.js";
import associatesRoutes from "./routes/associated.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import credentialsRoutes from "./routes/credentials.routes.js";
import authenticationRoutes from "./routes/authentication.routes.js"
import eventsRoutes from './routes/events.routes.js'
import courtesyRoute from './routes/courtesy.routes.js'
import binnacleUsers from "./middleware/binnacleUsers.js";
import userRequestsRoutes from "./routes/userRequests.routes.js";
import discountRoutes from "./routes/discount.routes.js";
import producerConfigurationRoutes from "./routes/producer.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/", }));


app.get("/", (req, res)=>{

res.send({
    message: 'test funcionando',
    isSucces: true
})

})


app.use("/api/place-su-routes", preventDesaster, placeSuRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/recerve-place", cheoutRoutes);
app.use("/api/tickets/", tickersRoutes);
app.use("/api/pago-movil/", pagoMovilReport);
app.use("/api/email/", emailRoutes);
app.use("/api/su-xd/", suValidator, binnacleUsers, suRoutes);
app.use("/api/services/", servicesRoutes);
app.use("/api/entrepreneur/", entrepreneurRoute);
app.use("/api/courtesy/", courtesyRoute);

app.use("/api/report/", reportRoute);
app.use("/api/packages/", packageRoutes);

app.use("/api/discount/", discountRoutes);


app.use("/api/streaming-menberships/", streamingMenbersRoutes);
app.use("/api/queue/", queueRoutes);
app.use("/api/sales/", salesRoutes);
app.use("/api/credentials/", credentialsRoutes);
app.use("/api/chat/", ...validatechat, chatRoutes);
app.use("/api/histories/", historiesRoutes);
app.use('/api/events/', eventsRoutes)

app.use("/api/authentication/", authenticationRoutes);

app.use("/api/associated/", associatesRoutes);

app.use("/api/user-requests/", userRequestsRoutes);

app.use("/api/producer/", producerConfigurationRoutes);



export default app;