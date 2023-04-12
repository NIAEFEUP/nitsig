import { spawn } from "child_process";
import { argv, exit, stderr } from "process";
import httpsLocalhost from "https-localhost";
import https from "https";
import watch from "watch";
import * as pathParser from 'node:path';
import { stat } from "fs";

const directoriesRegex=/(.*)(node_modules|out|bundle|dist)(.*)/;

const whitelistedFileTypes = [
    ".js",
    ".css",
    ".html",
    ".png"   
]

if(argv.length != 3){
    console.log("❌ Error: didn't provide a target...");
    console.log("🧳 Usage: yarn watch firefox|chrome|safari");
    exit(1);
}

let hasUpdate = false;

watch.watchTree(".", {
    ignoreDotFiles:true, 
    interval: 0.5,
    filter:(path, stats)=>{
        const parsedPath = pathParser.parse(path);
        if(parsedPath.dir == '' && stats.isDirectory()) return true;
        if(directoriesRegex.test(parsedPath.dir)) return false;
        console.log(parsedPath.dir);
        if(!stats.isDirectory()){
            return whitelistedFileTypes.includes(parsedPath.ext);
        }
        return true;
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


