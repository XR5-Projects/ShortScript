# ShortScript - A shorter version of JS

ShortScript is a shorter version of JavaScript, it is wriiten a file that has a ".sst" extension which can be imported in a Node.js file/program.

> [!NOTE]
> This module uses does not use/support ESM.

## Features

* Importable in a node.js file/program
* Covertable to js
* Compilable to a ShortScript program file, which can be run using the CLI

## Requirements

* Node v10.12.0 or later

## Install

* Module

```bash
$ npm i shortscript-main
# output is shown here
```

* CLI

```bash
$ npm i shortscript-cli
# global: npm i shortscript-cli -g
```

## Usage (module)

### Import module

```javascript
const sst = require("shortscript-module");
```

### Convert .sst to .js

```javascript
sst.convertScript(name: string) // coverts to .js
```

### Require .sst file

```javascript
sst.reqScript(name: string) // coverts to .js
```
