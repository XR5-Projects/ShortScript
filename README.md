# ShortScript - A shorter version of JS

ShortScript is a shorter version of JavaScript, it is wriiten a file that has a ".sst" extension which can be imported in a Node.js file/program.

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


## Usage (CLI Global)

```
Usage: sst | shortscript [options] [command]

CLI Tool for shortscript

Options:
  -V, --version                            output the version number
  -h, --help                               display help for command

Commands:
  run|r <file> <file>                      Runs .sst file
  init [options] [options]                 Initialise a shortscript project
  run-program|rpm [options] [file] [file]  Runs a compiled sst project (.sstz, .stz)
  compile|cp [options]                     Complies shortscript project
  help [command]                           display help for command
```

> [!NOTE]
> You can add npx before the cli if it is installed in the project.