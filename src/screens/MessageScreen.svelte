<script>
  import { fade } from "svelte/transition";
  import RoundButton from "../components/RoundButton.svelte";
  import MessageCard from "../components/MessageCard.svelte";
  export let messages = [];
  export let messageButtonAction = () => {};
  export let settingsButtonAction = () => {};
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
  }
  .main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow-y: auto;
    grid-row: 2;
    color: white;
  }
</style>

<div class="container" transition:fade={{ duration: 200 }}>
  <div class="header">
    <RoundButton
      source="./assets/settings-gears.svg"
      onClick={settingsButtonAction} />
    <RoundButton
      source="./assets/open-envelope.svg"
      onClick={messageButtonAction}
      withRoundBorder={true} />
  </div>
  <div class="main">
    {#each messages as { title, content, author }, i}
      <MessageCard {title} message={content} />
    {/each}
  </div>
</div>
