// We need some globals references
const peer = new Peer({host: 'localhost', port: 9000, path: '/myapp'})
let stream;
let peerDataConnection;

// Peer created conection
peer.on('open', (id)=>{
    console.log("my peer id is ", id)
})
// Peer conexion event
peer.on('connection', (dataConnection)=>{
    console.log(dataConnection)
    peerDataConnection = dataConnection
})
// Peer call event
peer.on('call', (call)=>{
    call.answer(stream)
    call.on('stream', (str)=>{
        const peerCam = document.getElementById('peer_camera')
        peerCam.srcObject = str
    })
})

function handleAnswerButton(){
    if (!peerDataConnection){
        console.log("Nadie te esta llamando porque no tienes amigos")
        return
    }
}

function handleCallButton(){
    const value = document.getElementById("peer-id-input").value
    console.log(`Trying to call ${value}`)
    const call = peer.call(value, stream)
    call.on('stream', (str)=>{
        const peerCam = document.getElementById('peer_camera')
        peerCam.srcObject = str
    })
}

function getUserMedia(){
    navigator.getUserMedia({video: true, audio: false},
    (str)=>{
        stream = str
        document.getElementById("my_camera").srcObject = str
    }, (error)=>{
        console.error(error)
    });
}

getUserMedia()