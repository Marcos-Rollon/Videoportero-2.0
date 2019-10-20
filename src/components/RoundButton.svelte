<script>
    export let source 
    export let onClick = () => {}
    export let withRoundBorder = false
    export let size = {width: "100px", height: "100px"}

    let isSelected = true
    let img
    function handleClick(){
        img.style = `transform : rotate(${isSelected ? "360deg" : "0deg"})`
        isSelected = !isSelected
        onClick()
    }
</script>

<style>
    .container{
        display: flex;
    }
    img{
        padding: 5px;
        width: 90%;
        height: 90%;
        transition: transform 0.6s ease-in-out;
    }
    .roundBorder{
        border: solid 2px white;
        border-radius: 50%;
    }
</style>

<div class="container" style="width={size.width}; height={size.height};" class:roundBorder={withRoundBorder}>
    <img bind:this={img} alt="" src="{source}" on:click={handleClick}>
</div>
