<script>
  import { fade } from "svelte/transition";
  import RoundButton from "../components/RoundButton.svelte";
  import { onDestroy, onMount } from "svelte";
  export let hangUpAction = () => {};
  export let answerAction = () => {};

  let audio = new Audio("./Assets/telephone-ring-3.wav");
  function playRingTone() {
    audio.play();
    audio.loop = true;
  }
  function stopRingTone() {
    audio.pause();
    audio.currentTime = 0;
  }
  onMount(() => {
    playRingTone();
  });
  onDestroy(() => {
    stopRingTone();
  });
</script>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
    height: 100%;
    width: 100%;
    background: linear-gradient(180deg, #000000 0%, #636161 100%);
  }
  .mainImage {
    width: 300px;
    height: 300px;
    margin: 10px;
    padding: 10px;
    border: solid white 4px;
    border-radius: 50%;
  }
  img {
    width: 100%;
    height: auto;
    border-radius: 50%;
  }
  .buttons-container {
    display: flex;
    width: 100%;
    justify-content: space-around;
  }
  .bounce-animation {
    animation-iteration-count: infinite;
    animation: bounce 0.6s infinite alternate;
    -webkit-animation: bounce 0.6s infinite alternate;
  }
  .rotate-animation {
    animation-iteration-count: infinite;
    animation: rotate 1s infinite alternate;
  }
  @keyframes bounce {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-15px);
    }
  }

  @keyframes rotate {
    from {
      transform: rotateZ(-30deg);
    }
    to {
      transform: rotateZ(30deg);
    }
  }
</style>

<div class="container">
  <h2>Llamando ...</h2>
  <div class="mainImage rotate-animation">
    <img src="./Assets/user.svg" alt="" />
  </div>
  <div class="buttons-container bounce-animation">
    <RoundButton
      source="./Assets/phone-hang-up.svg"
      withRoundBorder={true}
      borderColor="#6B0504"
      onClick={hangUpAction} />
    <RoundButton
      source="./Assets/call-answer.svg"
      withRoundBorder={true}
      borderColor="#47A025"
      onClick={answerAction} />
  </div>
</div>
