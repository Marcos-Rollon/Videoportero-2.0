<script>
  import RoundButton from "../components/RoundButton.svelte";
  import ClockElement from "../components/Clock.svelte";
  import { fade } from "svelte/transition";
  export let settingsButtonAction = () => {};
  export let messageButtonAction = () => {};
  export let connectedStatus = false
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
  }
  .header {
    display: flex;
    grid-row: 1;
    padding: 5px;
    justify-content: space-between;
    color:white;
  }
  .main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    grid-row: 2;
    color: white;
  }
  .main > h1 {
    font-size: 2em;
  }
  .connected{
    color: green;
  }
  .disconnected{
    color: red;
  }
</style>

<div class="container" transition:fade={{ duration: 200 }}>
  <div class="header">
    <RoundButton
      source="./assets/settings-gears.svg"
      onClick={settingsButtonAction} />
      <h2 class:connected="{connectedStatus}"
      class:disconnected="{!connectedStatus}">
        {connectedStatus ? "Conectado" : "Desconectado"}
      </h2>
    <RoundButton
      source="./assets/envelope.svg"
      onClick={messageButtonAction}
      withRoundBorder={true} />
  </div>

  <div class="main">
    <h1>[NOMBRE URBANIZACIÓN / INSTALACIÓN]</h1>
    <ClockElement showSeconds={false} />
  </div>

</div>
