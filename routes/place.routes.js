import { format } from "date-fns";
import { Router } from "express";
import getZone from "../controllers/places-controllers/getZone.js";
import updateAllChairsOfTheTableById from "../controllers/places-controllers/updateAllChairsOfTheTableById.js";
import updateAllChairsSelected from "../controllers/places-controllers/updateChairsSelected.js";
import updateAllDataOfCharisByRow from "../controllers/places-controllers/updateAllCahirsOrTableDataOfRow.js";

const routes = Router();

routes.get("/h", (req, res) => {
  const fromat = format(new Date(), "dd-MMM-uuuu-hh:mm:ss");

  res.send({ fromat });
});

routes.get("/get-zone", getZone);
routes.post(
  "/update-all-chairs-of-the-table-by-id",
  updateAllChairsOfTheTableById
);
routes.post("/update-all-selected-chairs", updateAllChairsSelected);
routes.post("/updates-all-chair-or-table-byo-row", updateAllDataOfCharisByRow);



export default routes;
