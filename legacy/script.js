// We need some globals references for the connection and peer shit
let peer;
let stream;
let socket;
let currentCaller = ""

// Constants and state
const SOCKET_SERVER_IP = "localhost:8000"
const SIGNALING_SERVER_IP = "localhost:9000"
let   UNIQUE_IDENTIFIER = "casa1"
let   isLoggedIn        = false

// Some ui element shit
const serverStatusElement   = document.getElementById('server_status')
const loginStatusElement    = document.getElementById('login_status')
const idServerInput         = document.getElementById('my-id')
const connectToServerBtn    = document.getElementById('connect_button')
const calleeIdInput         = document.getElementById('peer-id-input')
// Config and assing socket
function connectToSocketServer(){
    socket = io(SOCKET_SERVER_IP)
    // Assing socket events
    socket.on('connect', () => {
        console.log(`Socket connected with id ${socket.id}`);
        serverStatusElement.innerHTML = "SI"
    });
    socket.on('disconnect', (reason)=>{
        console.log('Socket disconnected from server')
        console.log(reason)
        serverStatusElement.innerHTML = "NO"
    })
    socket.on('sign-in-confirmation', data=>{
        //data =>{success : Bool}
        if (data.success){
            console.log('Server accepted signed in')
            console.log('Signed in with name : ', UNIQUE_IDENTIFIER )
            isLoggedIn = true
            configPeer()
        }else {
            console.log('Socket rejected signed in, someone else has our name')
            isLoggedIn = false
        }
        loginStatusElement.innerHTML = data.success ? "SI" : "NO"
    })
    socket.on('call-request', data =>{
        //data => {callerName : "String"}
        console.log(`Call request from ${data.callerName}`);
        currentCaller = data.callerName
    });
    socket.on('call-response', data =>{
        // data => {response : Bool}
        console.log(`Call response, it was ${data.response}`);
        if (data.response){
            startCall()
        }
    });
}

function signInInSocketServer(params){
    const name = params.name
    socket.emit('client-sign-in',{clientName : name})
}

function sendCallRequest(params){
    if (!params.callerName || !params.calleeId){
        return
    }
    socket.emit('call-request', {
        "callerName"    : params.callerName,
        "calleeId"      : params.calleeId
    })
}

function sendCallResponse(response){
    socket.emit('call-response', {
        callerName  : currentCaller,
        response    : response
    })
}

function configPeer(){
    if (isLoggedIn){
        peer = new Peer(UNIQUE_IDENTIFIER, {host: "localhost", port: 9000, path: "/myapp"})
        // Peer created conection
        peer.on('open', (id)=>{
            console.log("Connected to signaling server with id ", id)
        })
        // Peer conexion event
        // peer.on('connection', (dataConnection)=>{
        //     peerDataConnection = dataConnection
        // })
        // Peer call event
        peer.on('call', (call)=>{
            call.answer(stream)
            call.on('stream', (str)=>{
                const peerCam = document.getElementById('peer_camera')
                peerCam.srcObject = str
            })
        })
    } else {
        console.error('Cant configure peer without loggin in')
    }
}
function startCall(){
    const callee = calleeIdInput.value
    console.log("Trying to call ", callee)
    const call = peer.call(callee, stream)
    call.on('stream', (str)=>{
        const peerCam = document.getElementById('peer_camera')
        peerCam.srcObject = str
    })
}

function hangUpCall(){
    peer.destroy()
}

//Events and shit
document.getElementById('call_button').addEventListener('click', (ev)=>{
    ev.preventDefault()
    const value = document.getElementById("peer-id-input").value
    sendCallRequest({callerName : UNIQUE_IDENTIFIER, calleeId: value})
})

connectToServerBtn.addEventListener('click', (ev)=>{
    const value = idServerInput.value
    if (!value){
        console.log("Ponme un nombre pal servidor me cago en dio")
        return
    }
    UNIQUE_IDENTIFIER = value
    signInInSocketServer({name : UNIQUE_IDENTIFIER})
})

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

connectToSocketServer()