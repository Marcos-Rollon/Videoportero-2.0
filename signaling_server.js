const PORT = process.env.PORT || 9000;
const PeerServer = require("peer").PeerServer;
const server = PeerServer({ port: PORT, path: "/myapp" });

server.on("connection", id => {
  console.log(`Peer conected with id ${id}`);
});

server.listen(() => {
  console.log("Signaling server listening on port ", PORT);
});
