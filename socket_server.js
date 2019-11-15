const express = require("express");
const port = 8000;
let app = express();
const socket = require("socket.io");

let server = app.listen(port, err => {
  if (!err) {
    console.log(`Listening on port ${port}`);
  } else {
    console.error(`There was an error with the server`);
    console.error(err);
  }
});

let clientPath = __dirname + "/public";
app.use(express.static(clientPath));
app.use("/portero", express.static(__dirname + "/portero"))

const io = socket(server);

io.sockets.on("connection", newConnection);

let clients = [];

function newConnection(socket) {
  // Event sent from the client tho sign in
  socket.on("client-sign-in", data => {
    //data => {clientName : ""}

    let client = new Client({ socketid: socket.id, name: data.clientName });
    const clientAdded = addClient(client);
    if (clientAdded) {
      console.log("Current clients : ");
      console.log(clients);
    }
    io.to(socket.id).emit("sign-in-confirmation", { success: clientAdded });
  });
  socket.on("client-sign-out", data => {
    // data=>{clientName : ""}
    deleteClient(data.clientName);
  });
  //Delete clients on disconnect
  socket.on("disconnect", () => {
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].socketid === socket.id) {
        clients.splice(i, 1);
        break;
      }
    }
    console.log("Current clients: ");
    console.log(clients);
  });
  // Sent by the caller if he wants to hang up befor the peer conection is made
  socket.on("hang-up", data => {
    //data =>{calleeId: String}
    // Find the client
    const client = clients.find(element => {
      return element.name == data.calleeId;
    });
    if (!client) {
      console.log("Trying hang up to a client that it does not exits");
      return;
    }
    // Pipe event to callee
    io.to(client.socketid).emit('hang-up')
  })
  // Sent by the client to tell the door to open/close
  socket.on("door-events", data => {
    // data => {action : STRING, callerID: STRING}
    const client = clients.find(element => {
      return element.name == data.callerID;
    });
    if (!client) {
      console.log("Trying send door command to a client that does not exits");
      return;
    }
    io.to(client.socketid).emit("door-events", {
      action: data.action
    });
  })

  // Event sent from the caller to the callee
  socket.on("call-request", data => {
    //data => {callerName : "", calleeId : ""}
    // Find the client with this name and get the socket id
    const client = clients.find(element => {
      return element.name == data.calleeId;
    });
    if (!client) {
      console.log("Trying send a request to a client that it does not exits");
      return;
    }
    // Send to the callee a message with the name of the caller
    io.to(client.socketid).emit("call-request", {
      callerName: data.callerName
    });
  });

  //Event sent from the callee to respond to the caller
  socket.on("call-response", data => {
    // data => {callerName : "", response : Bool}
    // Find the client to respond to
    const client = clients.find(element => {
      return element.name == data.callerName;
    });
    if (!client) {
      console.log("Trying send a response to a client that it does not exits");
      return;
    }
    // Pipe to the caller the response from the callee
    io.to(client.socketid).emit("call-response", { response: data.response });
  });
}

// Utils functions

function deleteClient(clientName) {
  for (let i = 0; i < clients.length; i++) {
    if (clients[i].name === clientName) {
      console.log(`Client ${clientName} Deleted`);
      clients.splice(i, 1);
      return;
    }
  }
}

function addClient(client) {
  for (let i = 0; i < clients.length; i++) {
    if (clients[i].name === client.name) {
      console.error("Can't add client, there is someone else with his name");
      return false;
    }
    if (clients[i].socketid === client.socketid) {
      console.log("Same socket trying to re-login, changing name");
      clients[i].name = client.name;
      return true;
    }
  }
  clients.push(client);
  return true;
}

// Client class definition
class Client {
  constructor(params) {
    this.socketid = params.socketid;
    this.name = params.name;
  }
}
