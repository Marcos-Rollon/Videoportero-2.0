// UI References
const callButton = document.getElementById('call-button')
const hangUpButton = document.getElementById('hang-up-button')
const mainInput = document.getElementById('main-input')

// Constants
const SOCKET_SERVER_IP = "localhost:8000"
const SIGNALING_SERVER_IP = "localhost:9000"
const UNIQUE_IDENTIFIER = `Portero`

// App state
let isLoggedIn = false
let currentCalee = ""

// Global references
let socket
let peer
let ownStream

// Event assing
callButton.addEventListener('click', (ev) => {
    ev.preventDefault()
    const value = mainInput.value
    if (!value) {
        console.log("VALOR ERRONEO")
        return
    }
    if (tabla_pisos.includes(value)) {
        console.log("Trying to call ", value)
        sendCallRequest({ callerName: UNIQUE_IDENTIFIER, calleeId: value })
    } else {
        console.log("EL PISO NO EXISTE")
        return
    }
});
hangUpButton.addEventListener('click', (ev) => {
    ev.preventDefault()
    hangUpCall()
})

// Socket connection
// Config and assing socket
function connectToSocketServer() {
    socket = io(SOCKET_SERVER_IP)
    // Assing socket events
    socket.on('connect', () => {
        console.log(`Socket connected with id ${socket.id}`);
    });
    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected from server')
        console.log(reason)
    })
    socket.on('reconnect', (attemptNumber) => {
        console.log("Reconnected after ", attemptNumber, " tries")
        signInInSocketServer({ name: UNIQUE_IDENTIFIER })
    });
    socket.on('sign-in-confirmation', data => {
        //data =>{success : Bool}
        if (data.success) {
            console.log('Server accepted signed in')
            console.log('Signed in with name : ', UNIQUE_IDENTIFIER)
            isLoggedIn = true
            configPeer()
        } else {
            console.log('Socket rejected signed in, someone else has our name')
            isLoggedIn = false
        }
    })
    socket.on('call-response', data => {
        // data => {response : Bool}
        console.log(`Call response, it was ${data.response}`);
        if (data.response) {
            startCall(mainInput.value)
        }
    });

    socket.on("door-events", data => {
        console.log("Door event from client :")
        console.log(data.action);
    });
}

function signInInSocketServer(params) {
    const name = params.name
    socket.emit('client-sign-in', { clientName: name })
}
function sendCallRequest(params) {
    if (!params.callerName || !params.calleeId) {
        return
    }
    currentCalee = params.calleeId
    socket.emit('call-request', {
        "callerName": params.callerName,
        "calleeId": params.calleeId
    })
}

function configPeer() {
    if (isLoggedIn) {
        console.log("Connecting to signaling server...")
        peer = new Peer(UNIQUE_IDENTIFIER, { host: "localhost", port: 9000, debugg: 3, path: "/myapp" })
        // Peer created conection
        peer.on('open', (id) => {
            console.log("Connected to signaling server with id ", id)
        })
        // Peer call event
        peer.on('call', (call) => {
            call.answer(ownStream)
            call.on('stream', (str) => {
                const peerCam = document.getElementById('peer_camera')
                peerCam.srcObject = str
            })
        })
    } else {
        console.error('Cant configure peer without loggin in')
    }
}

function startCall(callee) {
    console.log("Trying to call ", callee)
    const call = peer.call(callee, ownStream)
    call.on('stream', (str) => {
        console.log("Peer stream event")
        const peerCam = document.getElementById('peer_camera')
        peerCam.srcObject = str
    })
}
function hangUpCall() {
    console.log("Colgado")
    const data = {
        calleeId: currentCalee
    }
    socket.emit('hang-up', data)
    peer.destroy()
}
function getUserMedia() {
    navigator.getUserMedia({ video: true, audio: true },
        (str) => {
            ownStream = str
            document.getElementById("my_camera").srcObject = ownStream
        }, (error) => {
            console.error(error)
        });
}

// Setup
document.addEventListener('DOMContentLoaded', () => {
    getUserMedia()
    connectToSocketServer()
    signInInSocketServer({ name: UNIQUE_IDENTIFIER })
});

