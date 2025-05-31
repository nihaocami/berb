const http = require("http");
const WebSocket = require("ws");
const express = require("express");

const app = express();

app.use(express.static("public"));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let peers = new Map();

wss.on("connection", (socket) => {
  const id = crypto.randomUUID();
  peers.set(id, socket);
  socket.send(JSON.stringify({ type: "id", id }));

  socket.on("message", (message) => {
    const data = JSON.parse(message);
    const target = peers.get(data.to);
    if (target) {
      target.send(JSON.stringify({ ...data, from: id }));
    }
  });

  socket.on("close", () => {
    peers.delete(id);
  });
});

const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => {
  console.log(`Signaling server running on http://localhost:${PORT}`);
});
