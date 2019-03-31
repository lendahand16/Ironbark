![Ironbark Logo](res/ironbark-logo-negative-128.png)

# Ironbark

An HTTP(S) server for serving a website.

It aims to provide dynamic content through JavaScript and JSON APIs as a replacement for PHP.

[Changelog](CHANGELOG.md)

## Todo List
- [ ] Merge `ironbark-build` and `ironbark-res-linker`
- [ ] Create an installer
- [ ] Create "SymLinks" for website paths.
  - [ ] Allow custom sub-domains.
  - [ ] Folder structure from /web/ and .ironbark config working.
  - [ ] Web Library Path `localhost/ironbark-lib/ironbark-weblib.js`
- [ ] Create a `.ironbark` config definition.
- [x] Create a proper build script.
  - [x] Create an "executable"
  - [x] Executable extract paths (IBInitialise)
  - [x] Include resource files into an IBResource object.
  - [x] Check for file existance before installing it into folder. (IBInitialise)
  - [x] Build configuration
  - [x] Add an entry to package.json file for source/resource files]
- [x] Resource builder
  - [x] Link Files
  - [x] Link Folder Trees
  - [x] Write Files
  - [x] Write Resource Tree
- [x] Create an "Ironbark Executable" creator API?
  - [x] Files to include
  - [x] Pretty much foundational version of `ironbark-build.js`

### Built Program Extract Folder Structure
```
ironbark/
+-- bin/
  +-- ironbark-release.js
  +-- node.exe
  +-- ironbark-launch.bat
+-- web/
  +-- .ironbark
  +-- index.html
  +-- favicon.ico
```

### `.ironbark` Config Definition Example
```javascript
{
    "subdomain": "example", // Set alias for folder - http://example.localhost/
    "allowSubdomainBelow": true, // Allow - http://sub.example.localhost/
    "errorPages": {
        404: "/users/uid/404.html"
    },
    "defaultPage": "index.html"
}
```

### Ironbark TS Compiler CLI
```
----------------------------------------------------------------
main.js
//@IBBuild::Include<header.ts>
import { Module } from "./header.ts";
//@IBBuild::Source
Module.thing();


----------------------------------------------------------------
header.ts
//@IBBuild::Include<header.ts>
//@IBBuild::Resource<res.txt>
//@IBBuild::Source
export let Fs: typeof import("fs") = require("fs");


----------------------------------------------------------------
CLI
node ibcompiler <mainEntryPoint.ts> [-r <resourceSearchPath>] [-d/--debug]
```