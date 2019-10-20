<script>
    import RoundButton from '../components/RoundButton.svelte'
    import ClockElement from '../components/Clock.svelte'
    export let  settingsButtonAction = ()=>{}


    function handleSettingsButton(){
        //TODO: Handle settings button to show shits
        console.log("loko")
    }
</script>
<style>
    .container {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 9fr;
        height: 100%;
        width:100%;
        background: linear-gradient(180deg, #000000 0%, #636161 100%);
    }
    .header{
        display: flex;
        grid-row: 1
    }
    .main{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        grid-row: 2;
        color:white;
    }
    .main > h1{
        font-size: 2em;
    }

</style>

<div class="container">
    <div class="header">
        <RoundButton 
        source="./assets/settings-gears.svg"
        onClick = {handleSettingsButton}
        />
        <RoundButton 
        source="./assets/envelope.svg"
        onClick = {handleSettingsButton}
        withRoundBorder = {true}
        />
    </div>

    <div class="main">
        <h1>Urbanización los manantiales</h1>
        <ClockElement showSeconds={false} />
    </div>
    
</div>