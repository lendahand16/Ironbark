/*
concat files
then output to .js
then minify
then install nodejs
then create launch.bat

*/
//@ts-check
var Path = require("path");
var Fs = require("fs");
var ChildProcess = require("child_process");
var BabelMinify = require("babel-minify");
var Tsc = require("typescript");

var LINKER_FILENAME  = "ironbark-res-linker.js"
var DEBUG_FILENAME   = "ironbark-debug.js";
var RELEASE_FILENAME = "ironbark-release.js";
var BIN_PATH         = Path.join(__dirname,"build","bin");
var DEBUG_FILE   = Path.join(BIN_PATH,DEBUG_FILENAME);
var RELEASE_FILE = Path.join(BIN_PATH,RELEASE_FILENAME);

var buildConfig = JSON.parse(Fs.readFileSync(Path.join(__dirname,"package.json")).toString())["IBBuild"];
var SRC_DIR = buildConfig.sourceDirectory   || "./src";
var SRC_FILES = buildConfig.sources;

function initDirectory() {
    if (!Fs.existsSync(BIN_PATH)) {
        Fs.mkdirSync(BIN_PATH);
    }
	// Create the debug and release files, overwriting if they are old or creating if they are new.
	Fs.writeFileSync(DEBUG_FILE,"");
	Fs.writeFileSync(RELEASE_FILE,"");
}

/** @param {string} sourceDir @param {string[]} sourceFiles */
function concatFiles ( sourceDir, sourceFiles ) {
    // Concatentate every TypeScript file.
    let output = "";
    for (var i=0; i<sourceFiles.length; i++) {
        var filePath = Path.join(sourceDir,sourceFiles[i]);
        var fileContents = Fs.readFileSync(filePath).toString();
        var sourceToInclude = fileContents.match(/((?<=\/\/@IBBuild::Include)([\s\S]*))/img);
        if (sourceToInclude) {
            output += "\n//@IBBuild::Name<"+sourceFiles[i]+">\n"+sourceToInclude[0]+";";
        }
    }
    return output;
}

/** Transpiles from TypeScript to JavaScript
@param {string} sourceCode */
function linkAndTranspile ( sourceCode ) {
    var transpiledCode = Tsc.transpileModule(sourceCode, {
        "compilerOptions": {
            target: Tsc.ScriptTarget.ES2015,
            strict: false
        }
        }).outputText;
    // Clear file ready for re-write with data/transpiled code
    //Fs.writeFileSync(DEBUG_FILE,"'use strict';\n");

    // Spawn linker to add _IBResourceData
    let output = ChildProcess.spawnSync('node',[Path.join(__dirname,LINKER_FILENAME)]).stdout.toString() + transpiledCode.replace(/(export)/g,"");
    return output;
}

/** Compresses source for distribution
@param {string} sourceCode */
function minifyCode ( sourceCode ) {
	// Use babel minify to shorten the output and improve speed/size
	var minifiedCode = BabelMinify(sourceCode, {
        keepClassName: false,
        keepFnName: false
		//@ts-ignore
		},{"comments":false}).code;
	return minifiedCode;
}

function IBBuild () {

    initDirectory();
    var concat = concatFiles(SRC_DIR, SRC_FILES);
    var debugBuild = linkAndTranspile(concat);
    var releaseBuild = minifyCode(debugBuild);
    //console.log(debugBuild);
    Fs.writeFileSync(DEBUG_FILE, debugBuild);
    Fs.writeFileSync(RELEASE_FILE, releaseBuild);
}
IBBuild();
