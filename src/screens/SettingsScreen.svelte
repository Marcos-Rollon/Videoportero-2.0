<script>
  import RoundButton from "../components/RoundButton.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let backButtonAction = () => {};
  export let defaultSignalingIP
  export let defaultSocketIP

  let signalingServerInput = localStorage.getItem("signaling-server-ip") || defaultSignalingIP
  let socketServerInput = localStorage.getItem("socket-server-ip") || defaultSocketIP
  let userIdentifierInput = localStorage.getItem("user-identifier") || "";
  let applyButton;

  function handleApplyButton() {
    if (!signalingServerInput || !socketServerInput || !userIdentifierInput) {
      console.error("No fields can be empty");
      applyButton.style = "background-color: red;";
    } else {
      applyButton.style = "background-color: #0091ff;";
      dispatch("settings-changes", {
        signalingServerIP: signalingServerInput,
        socketServerIP: socketServerInput,
        userIdentifier: userIdentifierInput
      });
    }
  }
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
    align-content: center;
    justify-content: left;
  }
  .main {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    padding: 10px;
    margin: 10px;
    text-align: justify;
  }
  .warning {
    color: yellow;
  }
  input {
    outline: none;
    width: 80%;
    height: 50px;
    border-radius: 45px;
    border: solid gray 1px;
  }
  button {
    outline: none;
    width: 40%;
    height: 50px;
    background-color: #0091ff;
    color: white;
    border-radius: 25px;
    border: none;
  }
  button:active {
    background-color: #003964;
  }
</style>

<div class="container">
  <div class="header">
    <RoundButton source="./assets/back.svg" onClick={backButtonAction} />
  </div>
  <div class="main">
    <p class="warning">
      No altere la configuración si no sabe lo que está haciendo, puede
      inutilizar completamente el sistema
    </p>
    <input
      type="text"
      placeholder="Signaling server IP"
      bind:value={signalingServerInput} />
    <input
      type="text"
      placeholder="Socket server IP"
      bind:value={socketServerInput} />
    <input
      type="text"
      placeholder="Client identifier"
      bind:value={userIdentifierInput} />
    <button on:click={handleApplyButton} bind:this={applyButton}>
      Aplicar
    </button>
    <p>Si tiene algún problema, contacte con soporte (952 11 11 11)</p>
  </div>
</div>
