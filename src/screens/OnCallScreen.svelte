<script>
  import RoundButton from "../components/RoundButton.svelte";
  import Clock from "../components/Clock.svelte";
  import { onDestroy, onMount } from "svelte";

  export let hangUpAction = () => {};
  export let openAction = () => {};
  export let videoSource;
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

<div class="container">
  <div class="header">
    <Clock showSeconds={false} />
  </div>
  <div class="main" />
  <video src="" poster="./Assets/user.svg" />
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
