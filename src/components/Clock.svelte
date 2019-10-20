<script>
  import { onMount, onDestroy } from "svelte";
  export let showSeconds = true;

  let clock;
  let t;
  function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    if (!showSeconds) {
      clock.innerHTML = h + ":" + m;
    } else {
      clock.innerHTML = h + ":" + m + ":" + s;
    }
    t = setTimeout(startTime, 500);
  }
  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }

  onMount(() => {
    startTime();
  });
  onDestroy(() => {
    clearInterval(t);
  });
</script>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  p {
    color: white;
    font-size: 3em;
  }
</style>

<div class="container">
  <p bind:this={clock} />
</div>
