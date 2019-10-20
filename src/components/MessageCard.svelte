<script>
  export let title;
  export let message;

  let isExpanded = false;
  let icon;
  function handleButton() {
    isExpanded = !isExpanded;
    icon.style = `transform: rotate(${isExpanded ? "90" : "-90"}deg)`;
  }
</script>

<style>
  .container {
    display: grid;
    grid-template-rows: 3fr 2fr;
    grid-template-columns: 1fr 9fr;
    grid-gap: 10px;
    padding: 20px;
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    width: 90%;
    text-align: justify;
    border: solid white 1px;
    border-radius: 30px;
  }
  .title {
    grid-row: 1;
    grid-column: 2;
    justify-self: left;
  }
  .icon {
    grid-row: 1;
    grid-column: 1;
  }
  img {
    width: 50px;
    height: 50px;
    transition: transform 0.2s ease-in-out;
    transform: rotate(-90deg);
  }
  .content {
    grid-row: 2;
    grid-column: 2;
    justify-self: left;
  }
  .hidden {
    display: none;
  }
</style>

<div class="container">
  <img
    bind:this={icon}
    src="./assets/back.svg"
    alt=""
    class="icon"
    on:click={handleButton} />
  <h2 class="title">{title}</h2>
  <p class="content" class:hidden={!isExpanded}>{message}</p>
</div>
