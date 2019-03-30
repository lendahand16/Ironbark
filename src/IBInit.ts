// Initialise Web Server Folders
import {
    Fs,
    Path,
    IBFoundation,
    _IBInstallRoot,
    _IBWebRoot
} from "./IBHeader";

//@IBBuild::Include
export function IBInit() {
    let moduleName = "IBInit";
    if (!(Path.basename(__dirname) === "bin")) {
        //throw new IBFoundation.IBError(moduleName, "Not in a bin folder");
        IBFoundation.exit(1);
    } else {
        // Create node_modules for required modules
        

        // Create web folder if it doesn't exist.
        if (!Fs.existsSync(_IBWebRoot)) {
            Fs.mkdirSync(_IBWebRoot);
            IBFoundation.log(moduleName,"Created web root-folder");
        }

        // Create index.html if it doesn't exist.
        if (!Fs.existsSync(_IBWebRoot+"/index.html")) {
            IBFoundation.writeResource("HTML_index",_IBWebRoot+"/index.html");
            IBFoundation.log(moduleName,"Created index.html");
        }

        // Create favicon.ico if it doesn't exist.
        if (!Fs.existsSync(_IBWebRoot+"/favicon.ico")) {
            IBFoundation.writeResource("ICO_favicon",_IBWebRoot+"/favicon.ico");
            IBFoundation.log(moduleName,"Created favicon.ico");
        }

        // Create .ironbark if it doesn't exist.
    }
}
