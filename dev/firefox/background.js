const watchConn = new WebSocket("ws://127.0.0.1:8069");


watchConn.addEventListener('message', (message) => {
    if(message.data == "reload"){
        chrome.runtime.reload();
    }
});
console.log("pog");

