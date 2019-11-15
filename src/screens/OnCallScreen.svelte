<script>
  import RoundButton from "../components/RoundButton.svelte";
  import { onDestroy, onMount } from "svelte";

  export let hangUpAction = () => {};
  export let openAction = () => {};
  export function setSource(src) {
    videoElement.srcObject = src;
  }
  let videoElement;
</script>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-gap: 10px;
    height: 100%;
    width: 100%;
    background: linear-gradient(180deg, #000000 0%, #636161 100%);
    color: white;
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
    width: 600px;
    height: 400px;
    max-width: 600px;
    max-height: 400px;
    padding-bottom: 30px;
    border-radius: 15px;
  }
</style>

<div class="container">
  <div class="main" />
  <video bind:this={videoElement} poster="./Assets/user.svg" autoplay />
  <div class="buttons-container">
    <RoundButton
      source="./Assets/phone-hang-up.svg"
      withRoundBorder={true}
      borderColor="#6B0504"
      onClick={hangUpAction} />
    <RoundButton
      source="./Assets/key_filled.svg"
      withRoundBorder={true}
      borderColor="#47A025"
      onClick={openAction} />
  </div>
</div>
