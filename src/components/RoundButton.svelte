<script>
  export let source;
  export let onClick = () => {};
  export let withRoundBorder = false;
  export let borderColor = "#fff";
  export let size = { width: "70px", height: "70px" };

  let isSelected = true;
  let img;
  function handleClick() {
    img.style.transform = `rotate(${isSelected ? "360deg" : "0deg"})`;
    isSelected = !isSelected;
    onClick();
  }
</script>

<style>
  .container {
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    align-content: center;
  }
  img {
    padding: 15px;
    transition: transform 0.6s ease-in-out;
  }
  .roundBorder {
    border: solid 2px white;
    border-radius: 50%;
  }
</style>

<div
  class="container"
  class:roundBorder={withRoundBorder}
  style="border-color:{borderColor}">
  <img
    bind:this={img}
    alt=""
    src={source}
    on:click={handleClick}
    style="width:{size.width}; height:{size.height};" />
</div>
