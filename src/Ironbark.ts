// Initialisation Script

/* 
===============================================================

Init folders/directories/files if they don't exist

ironbark.exe
./config/ (init)
    +ironbark-config.json
./ironbark-weblib/ (init)
    +ironbark-lib.js
./web/ (init)
    +.ironbark
    +index.html
    +favicon.ico

===============================================================

load config
load .ironbark per folder config
Start http/s server

===============================================================


*/

import {
    _IBInstallRoot,
    IBFoundation,
    IBInit,
    IBConfigLoader,
    Http,
    Fs,
    _IBWebRoot
} from "./IBHeader";

//@IBBuild::Include
IBInit();

let server = Http.createServer(function(req,res){
    IBFoundation.log("Ironbark","GET ->",req.headers.host+req.url);
    if (req.url === "/favicon.ico") {
        let favicon = Fs.readFileSync(_IBWebRoot+"/favicon.ico");
        res.writeHead(200, {
            "content-type": "image/x-icon"
        });
        res.end(favicon);
    } else {
        let outText = Fs.readFileSync(_IBWebRoot+"/index.html");
        res.writeHead(200, {
            "content-type": "text/html"
        });
        res.end(outText);
    }
}).listen(80,"0.0.0.0",()=>{
    IBFoundation.info("Ironbark","Started HTTP Server on PORT:80")
});