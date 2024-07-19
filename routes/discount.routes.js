import { Router } from "express";
import useDiscount from "../controllers/discount-controllers/useDiscount.js";

const routes = Router();

routes.post("/use-discount", useDiscount)


const discountRoutes = routes
export default discountRoutes;


