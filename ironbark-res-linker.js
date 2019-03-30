//@ts-check
var Path = require("path");
var Fs = require("fs");

var OUTPUT_BUFFER = "";

var buildOptions = JSON.parse(Fs.readFileSync("package.json").toString())["IBBuild"];
var RES_DIR = buildOptions["resourceDirectory"] || "./";
var RES_FILES = buildOptions["resources"];
//var MOD_FILES = buildOptions["modules"];

function buildResourceTree(dir, folder={}) {
    if (!Fs.statSync(dir).isDirectory()) {
        folder["FILE::"+String(Path.basename(dir))] = Fs.readFileSync(dir).toString("base64");
        folder["META::SINGLE"] = "FILE::"+String(Path.basename(dir));
    } else {
        Fs.readdirSync(dir).forEach( fileName => {
            let dirPath = Path.join(dir, fileName);
            if (Fs.statSync(dirPath).isDirectory()) {
                folder["DIR::"+fileName]={};
                buildResourceTree(dirPath, folder["DIR::"+String(fileName)]);
            } else {
                folder["FILE::"+fileName] = Fs.readFileSync(dirPath).toString("base64");
            }
        });
    }
    return folder;
};

OUTPUT_BUFFER += "var _IBResourceData={};";
for (var i=0; i<RES_FILES.length; i++) {
    let resourceDefinitionName = RES_FILES[i].name;
    let resourceDefinitionPath = RES_FILES[i].path;
    let realResourcePath = Path.join(RES_DIR,RES_FILES[i].path);

    if (!resourceDefinitionName || !resourceDefinitionPath) continue;
    if (!Fs.existsSync(realResourcePath)) continue;
    let resTree = buildResourceTree(realResourcePath,{});
    OUTPUT_BUFFER += "\n_IBResourceData."+resourceDefinitionName+"="+JSON.stringify(resTree)+";";
}

process.stdout.write(OUTPUT_BUFFER);
