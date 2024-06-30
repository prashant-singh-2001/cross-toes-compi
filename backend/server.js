import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "*",
});

const allUsers = {};
const allRooms = [];

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
      allRooms.push({
        p1: rival,
        p2: cu,
      });
      rival.socket.emit("RivalFound", {
        rival: cu.playerName,
        playingAs: "circle",
      });
      cu.socket.emit("RivalFound", {
        rival: rival.playerName,
        playingAs: "cross",
      });
      cu.socket.on("playerMovedFromClient", (data) => {
        rival.socket.emit("playerMovedFromServer", { ...data });
      });
      rival.socket.on("playerMovedFromClient", (data) => {
        cu.socket.emit("playerMovedFromServer", { ...data });
      });
    } else {
      cu.socket.emit("RivalNotFound");
    }
  });
  socket.on("disconnect", () => {
    const cu = allUsers[socket.id];
    cu.online = false;
    cu.playing = false;

    for (let index = 0; index < allRooms.length; index++) {
      const { p1, p2 } = allRooms[index];
      if (p1.socket.id === socket.id) {
        p2.socket.emit("RivalDisconnected");
        break;
      }
      if (p2.socket.id === socket.id) {
        p1.socket.emit("RivalDisconnected");
        break;
      }
    }
  });
});

httpServer.listen(3000);
