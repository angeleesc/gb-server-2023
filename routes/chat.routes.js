import { Router } from "express";
import evenRoonChat from "../controllers/chat-controllers/eventRoomChat.js";
import privateChats from "../controllers/chat-controllers/privateChats.js";

const routes = Router();

routes.post("/event-room-chat", evenRoonChat);
routes.post("/private-chat", privateChats);

export default routes;
