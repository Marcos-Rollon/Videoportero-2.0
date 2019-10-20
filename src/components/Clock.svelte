<script>
import {onMount} from 'svelte'
export let showSeconds = true

let clock
function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  if (!showSeconds){
    clock.innerHTML =  h + ":" + m;    
  }else {
    clock.innerHTML =  h + ":" + m + ":" + s;
  }
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

onMount(()=>{
    startTime()
})
</script>

<style>
    p{
        color: white;
        font-size: 3em;
    }
</style>

<p bind:this={clock}></p>