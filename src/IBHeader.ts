
// Ironbark Module Imports
export declare let IBFoundation: typeof import("./IBFoundation").IBFoundation;
export declare let IBInit: typeof import("./IBInit").IBInit;
export declare let IBConfigLoader: typeof import("./IBConfigLoader").IBConfigLoader;

export declare type T_ResourceName = 
    "HTML_index"|
    "IronbarkWebLib"|
    "ICO_favicon"
    ;

export declare let _IBResourceData: {
    [key in T_ResourceName]: any;
};
//@IBBuild::Resource<>
//@IBBuild::Resource<>
//@IBBuild::Resource<>
//@IBBuild::Source
//@IBBuild::Include
// NodeJS Module Imports
export let Fs: typeof import("fs") = require("fs");
export let Path: typeof import("path") = require("path");
export let Http: typeof import("http") = require("http");
//export let Colours: typeof import("colors/safe") = require("colors/safe");

export let _IBInstallRoot=__dirname+'/../.';
export let _IBWebRoot=__dirname+'/../web';
