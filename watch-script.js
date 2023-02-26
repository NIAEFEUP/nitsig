import { spawn } from "child_process";
import { argv, exit, stderr } from "process";

import watch from "watch";
import { WebSocketServer } from "ws"


const wss = new WebSocketServer({port: 8069});


wss.on('connection', (stream) => {
    console.log("⭐ The extension started listening for changes");
});

if(argv.length != 3){
    console.log("❌ Error: didn't provide a target...");
    console.log("🧳 Usage: yarn watch firefox|chrome|safari");
    exit(1);
}

watch.watchTree(".", {
    ignoreDotFiles:true, 
    filter:(path, stat)=>{
        //TODO (luisd): rewrite this lmao
        return (path.includes("background.js") || 
            path.includes("content-scripts") || 
            path.includes("popup") ||
            path.includes("css") ||
            path.includes("images") ||
            path.includes("dev"))
            && !(path.includes("bundle") 
                || path.includes('out') || 
                path.includes('node_modules') || 
                path.includes('dist'));
    }},
    async (f, curr, prev)  => {
        console.log("🔃 File %s changed... building bundle again...", f);
        const command = spawn('yarn', ['bundle', argv[2]]);
        command.stdout.on('data', (data) => {
            console.log("Build output: %s", data);
        })
        command.stderr.on('data', (data) => {
            console.log("❌ Build error: %s", data);
        })
        command.on('exit', (code) => {
            if(code == 0){
                console.log("🔃 Reloading clients...");
                wss.clients.forEach((client) => {
                    client.send("reload");
                })
            }
        })

});

