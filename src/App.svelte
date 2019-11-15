<script>
  //Imports
  import MainScreen from "./screens/MainScreen.svelte";
  import MessageScreen from "./screens/MessageScreen.svelte";
  import SettingsScreen from "./screens/SettingsScreen.svelte";
  import CallingScreen from "./screens/CallingScreen.svelte";
  import OnCallScreen from "./screens/OnCallScreen.svelte";
  import { Screens } from "./model/Screens.js";
  import io from "socket.io-client";
  // Peer is imported in the "bad" way in the public/index.html

  // State
  let currentPage = Screens.main;
  let messages = [];
  let isConnected = false;
  let isLoggedIn = false;
  //Global references
  let peer;
  let peerStream;
  let ownStream;
  let socket;
  let currentCaller;
  let onCallScreen;
  let connection; //Global reference to the connection with the current peer, used to send messages
  // Constants
  let SOCKET_SERVER_IP =
    localStorage.getItem("socket-server-ip") || "localhost:8000";
  let SIGNALING_SERVER_IP =
    localStorage.getItem("signaling-server-ip") || "localhost:9000";
  let UNIQUE_IDENTIFIER =
    localStorage.getItem("user-identifier") ||
    String(Math.random()).substr(0, 5);

  // MODEL FUNCTIONS
  // Config and assing socket
  function connectToSocketServer() {
    socket = io(SOCKET_SERVER_IP);
    socket.on("connect", () => {
      console.log(`Socket connected with id ${socket.id}`);
    });
    socket.on("reconnect", attemptNumber => {
      console.log("Reconnected after ", attemptNumber, " tries");
      signInInSocketServer({ name: UNIQUE_IDENTIFIER });
    });
    socket.on("disconnect", reason => {
      console.log("Socket disconnected from server");
      console.log(reason);
      isConnected = false;
      isLoggedIn = false;
    });
    socket.on("sign-in-confirmation", data => {
      //data =>{success : Bool}
      if (data.success) {
        console.log("Server accepted signed in");
        console.log("Signed in with name : ", UNIQUE_IDENTIFIER);
        isLoggedIn = true;
        isConnected = true;
        configPeer();
      } else {
        console.log("Socket rejected signed in, someone else has our name");
        isLoggedIn = false;
        isConnected = false;
      }
    });
    // Event sent when the caller hangs up bf peer conection is made
    socket.on("hang-up", () => {
      console.log("The caller has hung-up");
      Navigator(Screens.main);
    });
    socket.on("call-request", data => {
      //data => {callerName : "String"}
      console.log(`Call request from ${data.callerName}`);
      currentCaller = data.callerName;
      Navigator(Screens.calling);
    });
  }
  function disconnectFromSocketServer() {
    socket.close();
  }
  //params => {name : String}
  function signInInSocketServer(params) {
    const name = params.name;
    socket.emit("client-sign-in", { clientName: name });
  }

  function getUserMedia() {
    navigator.getUserMedia(
      { video: true, audio: true },
      str => {
        console.log("User media succesfully adquired");
        ownStream = str;
      },
      error => {
        console.error("Error getting user media");
        console.error(error);
      }
    );
  }
  function configPeer() {
    if (isLoggedIn) {
      console.log("Connecting to signaling server ...");
      peer = new Peer(UNIQUE_IDENTIFIER, {
        host: "localhost",
        port: 9000,
        path: "/myapp"
      });
      // Peer created conection
      peer.on("open", id => {
        console.log("Connected to signaling server with id ", id);
      });
      peer.on("disconnected", () => {
        console.log("Peer disconected");
        Navigator(Screens.main);
      });
      peer.on("close", () => {
        console.log("Peer closed");
        Navigator(Screens.main);
      });
      // Peer call event
      peer.on("call", call => {
        console.log("Answering call...");
        call.answer(ownStream);
        call.on("stream", str => {
          onCallScreen.setSource(str);
        });
      });
    } else {
      console.error("Cant configure peer without loggin in");
    }
  }

  function sendCallResponse(response) {
    socket.emit("call-response", {
      callerName: currentCaller,
      response: response
    });
  }

  // UI FUNCTIONS
  function handleMessageTapped() {
    // Just to test the calling ui, comment on production
    // Navigator(Screens.calling);
    // return;
    if (currentPage == Screens.main) {
      Navigator(Screens.message);
    } else {
      Navigator(Screens.main);
    }
  }
  function handleSettingsButton() {
    if (currentPage === Screens.settings) {
      Navigator(Screens.main);
    } else {
      Navigator(Screens.settings);
    }
  }
  function handleSettingsChanges(event) {
    Navigator(Screens.main);
    const newSocketIP = event.detail.socketServerIP;
    const newSignalingIP = event.detail.signalingServerIP;
    const newUserIdentifier = event.detail.userIdentifier;
    console.log("New credentials");
    console.log(newSocketIP);
    console.log(newSignalingIP);
    console.log(newUserIdentifier);
    SIGNALING_SERVER_IP = newSignalingIP;
    UNIQUE_IDENTIFIER = newUserIdentifier;
    SOCKET_SERVER_IP = newSocketIP;
    localStorage.setItem("socket-server-ip", SOCKET_SERVER_IP);
    localStorage.setItem("signaling-server-ip", SIGNALING_SERVER_IP);
    localStorage.setItem("user-identifier", UNIQUE_IDENTIFIER);
    // Update settings on server
    disconnectFromSocketServer();
    connectToSocketServer();
    signInInSocketServer({ name: UNIQUE_IDENTIFIER });
  }
  function handleAnswerButton() {
    sendCallResponse(true);
    Navigator(Screens.onCall);
  }
  function handleRejectButton() {
    sendCallResponse(false);
    Navigator(Screens.main);
    return;
  }
  function handleHangUpButton() {
    peer.destroy();
    Navigator(Screens.main);
  }
  function handleOpenButton() {
    if (!currentCaller) {
      return;
    }
    socket.emit("door-event", { action: "OPEN", callerID: currentCaller });
  }
  //Useless func since svelte is reactive, but still...
  function Navigator(destination) {
    currentPage = destination;
  }

  //INITIAL SETUP
  getUserMedia();
  connectToSocketServer();
  signInInSocketServer({ name: UNIQUE_IDENTIFIER });
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 9fr;
    grid-gap: 10px;
    height: 100%;
    width: 100%;
    background: linear-gradient(180deg, #000000 0%, #636161 100%);
    color: white;
  }
  .header {
    display: grid;
    padding: 10px;
    margin: 10px;
    align-content: center;
    justify-content: right;
  }
  .main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin: 10px;
    text-align: justify;
  }
  .buttons-container {
    display: flex;
    width: 100%;
    justify-content: space-around;
    padding-bottom: 30px;
  }
  video {
    justify-self: center;
    align-self: center;
    width: 80vw;
    height: 45vh;
    padding-bottom: 30px;
    border-radius: 15px;
  }
</style>

{#if currentPage === Screens.main}
  <MainScreen
    connectedStatus={isLoggedIn}
    messageButtonAction={handleMessageTapped}
    settingsButtonAction={handleSettingsButton} />
{:else if currentPage === Screens.message}
  <MessageScreen
    {messages}
    messageButtonAction={handleMessageTapped}
    settingsButtonAction={handleSettingsButton} />
{:else if currentPage === Screens.settings}
  <SettingsScreen
    defaultSignalingIP={SIGNALING_SERVER_IP}
    defaultSocketIP={SOCKET_SERVER_IP}
    backButtonAction={handleSettingsButton}
    on:settings-changes={handleSettingsChanges} />
{:else if currentPage === Screens.calling}
  <CallingScreen
    answerAction={handleAnswerButton}
    hangUpAction={handleRejectButton} />
{:else if currentPage === Screens.onCall}

  <OnCallScreen
    bind:this={onCallScreen}
    hangUpAction={handleHangUpButton}
    openAction={handleOpenButton} />
{/if}
