import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "*",
});

const allUsers = {};

io.on("connection", (socket) => {
  allUsers[socket.id] = { socket: socket, online: true, playing: false };
  socket.on("request_to_play", (data) => {
    const cu = allUsers[socket.id];
    cu.playerName = data.playerName;
    let rival = null;
    for (const key in allUsers) {
      const user = allUsers[key];
      if (user.online && !user.playing && socket.id != key) {
        rival = user;
        break;
      }
    }
    if (rival) {
      rival.socket.emit("RivalFound", { rival: cu.playerName });
      cu.socket.emit("RivalFound", { rival: rival.playerName });
    } else {
      cu.socket.emit("RivalNotFound");
    }
  });
  socket.on("disconnect", () => {
    const cu = allUsers[socket.id];
    cu.online = false;
  });
});

httpServer.listen(3000);
