import { Router } from "express";
import addProducerConfiguration from "../controllers/producer-configuration/addProducerConfiguration.js";

const routes = Router();

routes.post("/add-producer-configuration", addProducerConfiguration)


const producerConfigurationRoutes = routes
export default producerConfigurationRoutes;


