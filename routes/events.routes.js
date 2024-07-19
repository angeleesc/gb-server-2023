import {Router} from 'express';
import createNewEvent from '../controllers/events-controlers/createNewEvents.js';
const routes = Router();

routes.post('/', createNewEvent)

export default routes