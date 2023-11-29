#! /usr/bin/env node 

const {Command} = require("commander")
const pkg = require("./package.json")
const init = require("./init")
const compileProject = require("./compiler")
const decompile = require("./program-runner")
const program = new Command()

program
.name("shortscript")
.description("CLI Tool for shortscript")
.version(pkg.version)

program
.command("run <file>")
.description("Runs .sst file")
.alias("r")
.argument("<file>", "file to run (.sst)")
.usage("<file> [options]")
.action((file, rnd,  opts)=>{
    console.log("Not implemented yet.")
})

program
.command("init [options]")
.description("Initialise a shortscript project")
.option("-ni, --no-init", "No init")
.action(()=>{
    init(process.cwd())
})
.usage("[options]")

program
.command("run-program [file]")
.description("Runs a compiled sst project (.sstz, .stz)")
.argument("[file]", ".sstz, .stz (compiled sst project) file to run")
.option("-xs, --exec-script [name]", "Add this option to execute a script within your program")
.usage("[file] [options]")
.alias("rpm")
.action((file, rnd, opts)=>{
    decompile(file, opts)
})

program
.command("compile")
.description("Complies shortscript project")
.alias("cp")
.option("-nsc, --no-sst-conversion", "Tells the compiler to not convert .sst files to .js while compiling.")
.action((opts)=>{
    compileProject(process.cwd(), opts)
})

program.parse(process.argv)



program
.on("command:*", ()=>{
    program.help()
})

if (process.argv.length == 2) {
    program.help();
}