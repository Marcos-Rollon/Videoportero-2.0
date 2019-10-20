<script>
  //Imports
  import MainScreen from "./screens/MainScreen.svelte";
  import MessageScreen from "./screens/MessageScreen.svelte";
  import SettingsScreen from "./screens/SettingsScreen.svelte";
  import CallingScreen from "./screens/CallingScreen.svelte";
  import OnCallScreen from "./screens/OnCallScreen.svelte";
  import { Screens } from "./model/Screens.js";
  //import io from "socket.io-client";

  //console.log(io);
  //console.log(Peer);
  console.log("loko");
  // State
  let currentPage = Screens.main;
  let messages = [
    {
      title: "Titulo mensaje",
      content: "cuerpo mensaje"
    }
  ];
  //Global references
  let peer;
  let peerStream;
  let ownStream;
  let socket;
  let currentCaller;

  // Constants and state
  let SOCKET_SERVER_IP =
    localStorage.getItem("socket-server-ip") || "localhost:8000";
  let SIGNALING_SERVER_IP =
    localStorage.getItem("signaling-server-ip") || "localhost:9000";
  let UNIQUE_IDENTIFIER = localStorage.getItem("user-identifier") || "casa1";

  let isLoggedIn = false;

  // MODEL FUNCTIONS
  // Config and assing socket

  // UI FUNCTIONS
  function handleMessageTapped() {
    Navigator(Screens.calling);
    return;
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
    const newSocketIP = event.socketServerIP;
    const newSignalingIP = event.signalingServerIP;
    const newUserIdentifier = event.userIdentifier;
    SIGNALING_SERVER_IP = newSignalingIP;
    UNIQUE_IDENTIFIER = newUserIdentifier;
    SOCKET_SERVER_IP = newSocketIP;
    localStorage.setItem("socket-server-ip", SOCKET_SERVER_IP);
    localStorage.setItem("signaling-server-ip", SIGNALING_SERVER_IP);
    localStorage.setItem("user-identifier", UNIQUE_IDENTIFIER);
  }
  function handleAnswerButton() {
    Navigator(Screens.onCall);
  }
  function handleHangUpButton() {
    Navigator(Screens.main);
  }
  function handleOpenButton() {}
  //Useless func since svelte is reactive, but still...
  function Navigator(destination) {
    currentPage = destination;
  }
</script>

<style>

</style>

{#if currentPage === Screens.main}
  <MainScreen
    messageButtonAction={handleMessageTapped}
    settingsButtonAction={handleSettingsButton} />
{:else if currentPage === Screens.message}
  <MessageScreen
    {messages}
    messageButtonAction={handleMessageTapped}
    settingsButtonAction={handleSettingsButton} />
{:else if currentPage === Screens.settings}
  <SettingsScreen
    backButtonAction={handleSettingsButton}
    on:settings-changes={handleSettingsChanges} />
{:else if currentPage === Screens.calling}
  <CallingScreen
    answerAction={handleAnswerButton}
    hangUpAction={handleHangUpButton} />
{:else if currentPage === Screens.onCall}
  <OnCallScreen
    videoSource={peerStream}
    hangUpAction={handleHangUpButton}
    openAction={handleOpenButton} />
{/if}
