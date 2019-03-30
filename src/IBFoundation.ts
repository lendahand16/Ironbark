// core of the web server backend
import {
    Fs,
    Path,
    T_ResourceName,
    _IBInstallRoot,
    _IBWebRoot,
    _IBResourceData
} from "./IBHeader";

export let SymLinks = {
    "/ironbark-weblib.js": {
        "mime": "text/javascript",
        "resource": "IronbarkWebLib"
    }
};

//@IBBuild::Include
export namespace IBFoundation {

    export function writeResource(resourceName: T_ResourceName, path: string) {
        if (_IBResourceData[resourceName]) {
            if (_IBResourceData[resourceName]["META::SINGLE"]) {
                Fs.writeFileSync(path, Buffer.from(_IBResourceData[resourceName][_IBResourceData[resourceName]["META::SINGLE"]],"base64"));
            } else {
                function writeData (resource: any, prevDirs: string[]) {
                    // Keys in the IBResource
                    let keys = Object.keys(resource);
                    let dirs = keys.filter(v=>v.startsWith("DIR::"));
                    let files= keys.filter(v=>v.startsWith("FILE::"));
                    
                    files.forEach(file=>{
                        let filePath = Path.join(...prevDirs,file.replace(/FILE::/,''));
                        //console.log(Path.join(...prevDirs,file.replace(/FILE::/,'')),"|", resource[file]);
                        if (!Fs.existsSync(Path.dirname(filePath))) {
                            Fs.mkdirSync(Path.dirname(filePath));
                        }
                        Fs.writeFileSync(filePath, Buffer.from(resource[file]));
                    });

                    dirs.forEach(dir=>{
                        let branchDirs = prevDirs;
                        branchDirs.push(dir.replace(/DIR::/,''));
                        writeData(resource[dir], branchDirs);
                    });
                }
                writeData(_IBResourceData[resourceName],[path]);
            }
            //Fs.writeFileSync(path, Buffer.from(_IBResource[resourceName],"base64"));
        } else {
            throw "Resource not linked to executable.";
        }
    }
    
    export function exit(code=0) {
        if (code > 0) {
            IBFoundation.error("Ironbark","Exited with code: IB("+String(code)+")");
        } else {
            IBFoundation.log("Ironbark","Exited without errors.");
        }
        process.exit(0);
        return;
    }

    function _print ( level:"ERROR"|"WARN"|"INFO"|"NONE", moduleName: string, messages: any[]) {
        let time = new Date();
        let timeStr = "["+String(time.getHours()).padStart(2,'0')+":"+String(time.getMinutes()).padStart(2,'0')+":"+String(time.getSeconds()).padStart(2,'0')+"."+String(time.getMilliseconds()).padStart(3,'0')+"]";
        let moduleStr = "";
        if (level === "ERROR") {
            //moduleStr = Colours.red(Colours.bold(":::"+moduleName+":::"));
            moduleStr = ":::"+moduleName+":::";
        } else if (level === "WARN"){
            //moduleStr = Colours.cyan("..."+moduleName+"...");
            moduleStr = "..."+moduleName+"...";
        } else if (level === "INFO"){
            //moduleStr = "["+Colours.green(moduleName)+"]";
            moduleStr = "[-"+moduleName+"-]";
        } else {
            //moduleStr = "["+moduleName+"]";
            moduleStr = "["+moduleName+"]";
        }
        messages.unshift(timeStr+moduleStr);
        console.log.apply(null, messages);
    }

    export function log ( moduleName: string, ...messages: any[] ): void {
        _print("NONE",moduleName,messages);
    }

    export function info ( moduleName: string, ...messages: any[] ): void {
        _print("INFO",moduleName,messages);
    }
    
    export function warn ( moduleName: string, ...messages: any[] ): void {
        _print("WARN",moduleName,messages);
    }

    export function error ( moduleName: string, ...messages: any[] ): void {
        _print("ERROR",moduleName,messages);
    }


}
