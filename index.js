import app from "./app.js";
import { Server as WebsocketServer } from "socket.io";
import http from "http";

const server = http.createServer(app);
const httpServer = server.listen(5000);
const io = new WebsocketServer(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "192.168.1.114:3000/stage-plans-simulator",
    ],
    methods: ["GET", "POST"],
  },
});


io.on("connection", async (socket) => {
  socket.emit("saludo-xd", {message: "hola XD"})
});

console.log("servido socket global boletos funcionando XD en el puerto", 5000);
