import { spawn } from "child_process";
import { argv, exit, stderr } from "process";
import httpsLocalhost from "https-localhost";
import https from "https";
import watch from "watch";


if(argv.length != 3){
    console.log("❌ Error: didn't provide a target...");
    console.log("🧳 Usage: yarn watch firefox|chrome|safari");
    exit(1);
}

let hasUpdate = false;

watch.watchTree(".", {
    ignoreDotFiles:true, 
    filter:(path, stat)=>{
        //TODO (luisd): rewrite this lmao
        return (path.includes("background.js") || 
            path.includes("content-scripts") || 
            path.includes("popup") ||
            path.includes("css") ||
            path.includes("images") ||
            path.includes("dev") ||
            path.includes("html"))
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
                console.log("🔃 Reloading Clients...");
            }
            hasUpdate = true;
        })

});

const certs = await httpsLocalhost().getCerts();
const server = https.createServer(certs,(req, res) => {
    if(req.method == "GET" && req.url == "/hasUpdate"){
        res.writeHead(200, {"Access-Control-Allow-Origin":"*"});
        res.end(JSON.stringify({update: hasUpdate}));
        if(hasUpdate){
            hasUpdate = false;
        }
        return;
    }
    res.writeHead(500);
    res.end();
}).listen(8069, "0.0.0.0");


