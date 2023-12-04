//const fs = require("fs")
const asar = require("@electron/asar")
const chalk = require("chalk")
const dataInt = require("./lib/data")
const pathMod = require("path")
const fs = require("node:fs")
const child_process = require("node:child_process")
const converter = require("./lib/coverter")
const EventEmitter = require("events")
const { setMaxListeners } = require("events")
const cryjs = require('./lib/crypt')
const crypto = require("node:crypto")
const tempCleaner = require("./lib/temp-cleaner")
const readline = require("readline")

var num = {
    folders: 0,
    files: 0
}
setMaxListeners(20)

function cypherFile(file, key) {
    var algo = "aes-256-gcm"
    var keyl = crypto.createHash("sha256")
        .update(key)
        .digest("base64")
        .substring(0, 32)

    return {
        encrypt: () => {
            const buf = fs.readFileSync(file)
            const iv = crypto.randomBytes(32)
            const cy = crypto.createCipheriv(algo, keyl, iv)

            const res = Buffer.concat([iv, cy.update(buf), cy.final()])
            fs.writeFileSync(file, res)

            return cy.getAuthTag().toString("hex")
        },
        decrypt: (tag) => {
            const cry = fs.readFileSync(file)
            const iv = cry.slice(0, 32)
            cry = cry.slice(32)

            const de = crypto.createDecipheriv(algo, keyl, iv)
            de.setAuthTag(Buffer.from(tag, "hex"))
            const res = Buffer.concat([de.update(cry), de.final()])

            fs.writeFileSync(file, res)
        }
    }
}
function loger(task, msg) {
    process.stdout.write(`${task} : ${msg} `)
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
}
function logger(task, msg) {
    process.stdout.write(`${chalk.bgWhite(task)} : ${msg} `)
    return {
        clear: () => {
            process.stdout.clearLine()
            process.stdout.cursorTo(0)
        },
    }
}
function projectId(id) {
    return {
        save: (path) => {
            var data = dataInt.readdata("projects").data
            var saveData = {
                id: id,
                last_mod: new Date(),
                path: path
            }
            data.push(saveData)
            dataInt.writedata("projects", data)
        },
        id: id,
        verify: () => {
            var data = dataInt.readdata("projects").data
            var dInt = data.findIndex(code => code.id == id)

            if (dInt > -1) {
                return true
            } else {
                return false
            }
        }
    }
}
function generateString(length) {
    var characters = "123456789012345678900987654321abcdefghijklmnopqrstuvwxyzZYXWVUTSRQPONMLKJIHGFEDCBA23456789012345678900987654313579246810"
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
const copyRec = (src, dest) => {
    const exist = fs.existsSync(src)
    const stats = exist && fs.statSync(src)
    const isDir = stats && stats.isDirectory()

    if (isDir) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);

        fs.readdirSync(src).forEach((vas, ind, ass) => {
            copyRec(pathMod.join(src, vas), pathMod.join(dest, vas))
        })
    } else {
        if (!fs.existsSync(dest))
            fs.copyFileSync(src, dest)
    }
}
const convertRec = (src) => {
    const exist = fs.existsSync(src)
    const stats = exist && fs.statSync(src)
    const isDir = stats && stats.isDirectory()

    if (isDir) {

        fs.readdirSync(src).forEach((vas, ind, ass) => {
            convertRec(pathMod.join(src, vas))
        })
    } else {
        if (src.endsWith(".sst")) {
            var dataFile = fs.readFileSync(src, { encoding: "utf-8" })
            var convData = converter(dataFile)
            fs.writeFileSync(src.replace(".sst", ".js"), convData)
            fs.unlinkSync(src)
        }
    }
}
const cryptRec = (srck, key) => {
    var src = srck
    const exist = fs.existsSync(src)
    const stats = exist && fs.statSync(src)
    const isDir = stats && stats.isDirectory()
    if (isDir) {
        fs.readdirSync(src).forEach((vas, ind, ass) => {
            cryptRec(`${src}/${vas}`, key)
        })
    } else {
        var dataFile = fs.readFileSync(src, { encoding: "utf-8" })
        var convData = cryjs.encryptText(dataFile, key).data

        if (src.endsWith(".js")) {
            fs.writeFileSync(src.replace(".js", ".ssc"), convData)
            fs.unlinkSync(src)
        }
        if (src.endsWith(".d.ts")) {
            fs.writeFileSync(src.replace(".d.ts", ".ssdt"), convData)
            fs.unlinkSync(src)
        }
        if (src.endsWith(".ts")) {
            fs.writeFileSync(src.replace(".ts", ".ssy"), convData)
            fs.unlinkSync(src)
        }
        if (src.endsWith(".mjs")) {
            fs.writeFileSync(src.replace(".mjs", ".ssm"), convData)
            fs.unlinkSync(src)
        }
        if (src.endsWith(".cjs")) {
            fs.writeFileSync(src.replace(".cjs", ".sscs"), convData)
            fs.unlinkSync(src)
        }
        if (src.endsWith(".jsx")) {
            fs.writeFileSync(src.replace(".jsx", ".sscx"), convData)
            fs.unlinkSync(src)
        }
        if (src.endsWith(".tsx")) {
            fs.writeFileSync(src.replace(".tsx", ".ssyx"), convData)
            fs.unlinkSync(src)
        }
        if (src.endsWith(".json")) {
            fs.writeFileSync(src.replace(".json", ".sson"), convData)
            fs.unlinkSync(src)
        }
        if (src.endsWith(".sst")) {
            fs.writeFileSync(src.replace(".sst", ".sstc"), convData)
            fs.unlinkSync(src)
        }
    }
}
const countRec = (src, ig) => {
    const exist = fs.existsSync(src)
    const stats = exist && fs.statSync(src)
    const isDir = stats && stats.isDirectory()
    if (isDir) {
        var int = ig.findIndex(es => es == src.split("\\")[parseInt(src.split("\\").length) - 1])
        if (int < 0) {
            num.folders = num.folders + 1
            fs.readdirSync(src).forEach((vas, ind, ass) => {
                countRec(pathMod.join(src, vas), ig)
            })
        } else {
            fs.readdirSync(src).forEach((vas, ind, ass) => {
                countRec(pathMod.join(src, vas), ig)
            })
        }
    } else {
        var int = ig.findIndex(es => es == src.split("\\")[parseInt(src.split("\\").length) - 1])
        if (int < 0) {
            num.files = num.files + 1
        }
    }
}
function delRec(root, files, cb) {
    if (files.length == 0) {
        cb()
    }
    try {
        for (var ind in files) {
            var fi = files[ind]
            var src = pathMod.join(root, fi)
            const exist = fs.existsSync(src)
            var cbfunc = ()=>{
                    const isDir = fs.statSync(src).isDirectory()
                    if (exist&&isDir) {
                        var dpl = child_process
                            .exec(`cd ${root}&&rmdir /s /q "${fi}"`, () => { dpl.on("message", () => { dpl.kill("SIGKILL") }) })
                        cb()
                    } else if(exist){
                        var dpl = child_process
                            .exec(`cd ${root}&&del /f "${fi}"`, () => { dpl.on("message", () => { dpl.kill("SIGKILL") }) })
                        cb()
                }
            }
            var norfunc = ()=>{
                
                    const isDir = fs.statSync(src).isDirectory()
                    if (exist&&isDir) {
                        var dpl = child_process
                            .exec(`cd ${root}&&rmdir /s /q "${fi}"`, () => { dpl.on("message", () => { dpl.kill("SIGKILL") }) })

                    } else if(exist){
                        var dpl = child_process
                            .exec(`cd ${root}&&del /f "${fi}"`, () => { dpl.on("message", () => { dpl.kill("SIGKILL") }) })
                    }
            }

            if (ind == files.length - 1) {
                cbfunc()
            } else {
                norfunc()
            }
        }
    } catch (e) {
        console.log(e)
        process.exit()
    }
}


function compileProject(path, opts) {
    var time_taken = 0
    var time_taken_counter = setInterval(() => {
        time_taken = time_taken + 1
    }, 1000)
    tempCleaner()
    var configDir = `${path}/package.json`
    var dtd = logger(chalk.blue("Compiling"), "Checking config...")
    if (!fs.existsSync(configDir)) {
        dtd.clear()
        console.log(chalk.bgWhite(chalk.red("Error")), ":", "This is not a proper sst project, please intialise it before compile. [1]")
        process.exit()
    }
    var pkg = JSON.parse(fs.readFileSync(configDir, { encoding: "utf-8" }))
    if (!pkg.sstConfig) {
        dtd.clear()
        console.log(chalk.bgWhite(chalk.red("Error")), ":", "This is not a proper sst project, please intialise it before compile. [2]")
        process.exit()
    }
    var s = projectId(pkg.sstConfig.keySign)
    try {
        dtd.clear()
        if (!s.verify()) {
            console.log(chalk.bgWhite(chalk.red("Error")),
                ":",
                "This is an invalid project, please re-intialise the project. [3]"
            )
            process.exit()
        }

        dtd = logger(chalk.bgWhite(chalk.blue("Compiling")), "Scanning Values...")

        if (!fs.existsSync(pkg.main)) {
            dtd.clear()
            console.log(chalk.bgWhite(chalk.red("Error")),
                ":",
                "The project is missing its main file in directory/folder."
            )
            process.exit()
        }
        dtd = logger(chalk.bgWhite(chalk.blue("Compiling")), "Copying Files...")

        var modCheckInt = pkg.sstConfig.ignore.findIndex(e => e == "node_modules")
        var continue_func = (file_ignore) => {

            var ignore = file_ignore
            var tempdir = `${dataInt.dir}/temp/${generateString(45)}`
            countRec(path, ignore)

            if (!fs.existsSync(`${dataInt.dir}/temp`)) {
                fs.mkdirSync(`${dataInt.dir}/temp`)
            }
            if (!fs.existsSync(tempdir)) {
                fs.mkdirSync(tempdir)
            }

            dtd.clear()
            dtd = logger(chalk.blue("Compiling"), `Copying ${num.files} files and ${num.folders} folders...`)
            copyRec(path, tempdir)
            dtd.clear()
            dtd = logger(chalk.blue("Compiling"), "Scanning Files...")
            if (opts.sstConversion) {
                convertRec(tempdir)
            }
            dtd.clear()

            dtd = logger(chalk.blue("Compiling"), "Assembling compiled file... [1/4]")
            var keyj = generateString(32)
            delRec(tempdir, ignore, () => {
                var timeout_cont = () => {
                    if (file_ignore.length == 0) {
                        return 5000
                    } else {
                        return file_ignore.length * 550
                    }
                }

                cryptRec(tempdir, keyj)
                setTimeout(() => {
                    dtd.clear()
                    dtd = logger(chalk.blue("Compiling"), "Assembling compiled file... [2/4]")
                    var temp_01_dir = pathMod.join(dataInt.dir, "temp_01", generateString(20))
                    var crip = {
                        name: pkg.name,
                        version: pkg.version,
                        main: pkg.main,
                        sign: keyj
                    }
                    asar.createPackage(tempdir, pathMod.join(temp_01_dir, "bin"))
                        .then(() => {
                            var auth = cypherFile(pathMod.join(temp_01_dir, "bin"), crip.sign)
                                .encrypt()
                            crip.auth = auth
                            fs.writeFileSync(pathMod.join(temp_01_dir, "info"), JSON.stringify(crip, null, 2))
                            dtd.clear()
                            dtd = logger(chalk.blue("Compiling"), "Assembling compiled file... [3/4]")

                            setTimeout(() => {
                                dtd.clear()
                                dtd = logger(chalk.blue("Compiling"), "Assembling compiled file... [4/4]")
                                var output = pathMod.join(path, "out", `${pkg.name}-v${pkg.version}.sstz`)
                                asar.createPackage(temp_01_dir, output)
                                    .then(() => {
                                        dtd.clear()
                                        dtd = logger(chalk.blue("Compiling"), "Finishing up...")
                                        child_process
                                            .exec(`rmdir /s /q "${tempdir}"`, (err) => {
                                            })
                                        child_process
                                            .exec(`rmdir /s /q "${temp_01_dir}"`, (err) => {
                                            })
                                        dtd.clear()
                                        clearInterval(time_taken_counter)
                                        console.log(chalk.bgWhite(chalk.green("Compile")) + ` : Done compiling project in ${time_taken}s`)
                                    })
                                    .catch((e) => {
                                        dtd.clear()
                                        console.log(chalk.bgWhite(chalk.red("Error")), + " : " + e)
                                    })

                            }, 2000)

                        })
                }, timeout_cont())
            })
        }
        
        var tas = [...new Set(pkg.sstConfig.ignore)]
        const ignore_filter1 = ()=>{
            tas.forEach((v, i)=>{
                if(!fs.existsSync(pathMod.join(path, v))){
                    tas.splice(tas.findIndex(e=>e==v), 1)
                }
            })
        }
        ignore_filter1()

        fs.writeFileSync("tas.json", JSON.stringify(tas, null, 2))
        if (modCheckInt > -1 && fs.existsSync(pathMod.join(path, "node_modules"))) {
            dtd.clear()
            var qier = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })

            qier.question("the 'node_modules' folder was found in your ignore config, this may cause problems but do you want to continue (Y/N):\n>", (ans) => {
                if (ans.toUpperCase() == "Y" || ans.toLowerCase() == "yes") {
                    qier.close()
                    dtd = logger(chalk.bgWhite(chalk.blue("Compiling")), "node_modules folder will be ignored.")
                    var filtered_ignore = tas.splice(modCheckInt, 1)
                    setTimeout(() => {
                        continue_func(filtered_ignore)
                    })
                } else {
                    qier.close()
                    dtd = logger(chalk.bgWhite(chalk.blue("Compiling")), "node_modules folder will not be ignored.")
                    setTimeout(() => {
                        continue_func(tas)
                    })
                }
            })
        } else {
            setTimeout(() => {
                continue_func(tas)
            })
        }

    } catch (e) {
        dtd.clear()
        console.log(chalk.bgWhite(chalk.red("Error")), ":", e)
        process.exit()
    }
}


module.exports = compileProject