const [
    path,
    fs,
    cryjs,
    asar,
    child_process,
    chalk,
    crypto,
    dataInt,
    { setMaxListeners },
    readline
] = [
        require("node:path"),
        require("node:fs"),
        require("./lib/crypt"),
        require("@electron/asar"),
        require("node:child_process"),
        require("chalk"),
        require("node:crypto"),
        require("./lib/data"),
        require("node:events"),
        require("node:readline")
    ]

setMaxListeners(29)

function logger(task, msg) {
    process.stdout.write(`${chalk.bgWhite(task)} : ${msg} `)
    return {
        clear: () => {
            process.stdout.clearLine()
            process.stdout.cursorTo(0)
        },
        update: (tsk, mg) => {
            process.stdout.clearLine()
            process.stdout.cursorTo(0)
            process.stdout.write(`${chalk.bgWhite(tsk)} : ${mg} `)
        }
    }
}
function cypherBuffer(buf, key) {
    var algo = "aes-256-gcm"
    var keyl = crypto.createHash("sha256")
        .update(key)
        .digest("base64")
        .substring(0, 32)

    return {
        encrypt: () => {
            const iv = crypto.randomBytes(16)
            const cy = crypto.createCipheriv(algo, keyl, iv)
            const res = Buffer.concat([iv, cy.update(buf), cy.final()])

            return res
        },
        decrypt: () => {
            var cry = buf
            const iv = cry.slice(0, 16)
            cry = cry.slice(16)

            const de = crypto.createDecipheriv(algo, keyl, iv)
            const res = Buffer.concat([de.update(cry), de.final()])

            return res
        }
    }
}

var sstz_files = []
const searchRec = (src) => {
    const exist = fs.existsSync(src)
    const stats = exist && fs.statSync(src)
    const isDir = stats && stats.isDirectory()
    if (isDir) {
        fs.readdirSync(src).forEach((vas, ind, ass) => {
            searchRec(path.join(src, vas))
        })
    } else {
        if (src.endsWith(".sstz")) {
            sstz_files
                .push(src)
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
            var cry = fs.readFileSync(file)
            const iv = cry.slice(0, 32)
            cry = cry.slice(32)

            const de = crypto.createDecipheriv(algo, keyl, iv)
            de.setAuthTag(Buffer.from(tag, "hex"))
            const res = Buffer.concat([de.update(cry), de.final()])

            fs.writeFileSync(file, res)
        }
    }
}
function decompile(file, opts) {
    var log = logger(chalk.blue("Run"), "Checking system...")
    var func1 = () => {
        log.update(chalk.blue("Run"), "Checking program...")
        var bu = asar.extractFile(file, "info")
        var info = JSON.parse(bu.toString("utf8"))
        var tempdir_01 = path.join(dataInt.dir, "temp", generateString(20))
        var tempdir_02 = path.join(dataInt.dir, "temp_01", generateString(20))
        var tempbin = path.join(tempdir_02, "bin")

        log.update(chalk.blue("Run"), "Loading program... [1/2]")
        asar.extractAll(file, tempdir_02)
        cypherFile(tempbin, info.sign).decrypt(info.auth)

        log.update(chalk.blue("Run"), "Loading program... [2/2]")
        asar.extractAll(tempbin, tempdir_01)

        if (!opts.execScript) {
            var node = child_process.exec(`node ${path.join(tempdir_01, info.main)}`, () => { })
        } else {
            var node = child_process.exec(`cd ${tempdir_01}&&npm run ${opts.execScript}`, () => { })
        }

        log.update(chalk.blue("Run"), `Running ${info.name} v${info.version}`)
        node.stdout.on("data", (cd) => {
            log.clear()
            console.log(cd)
        })
        node.stderr.on("data", (cd)=>{
            log.clear()
            console.log(cd)
        })

        node.on("exit", () => {
            child_process
                .exec(`rmdir /s /q "${tempdir_01}"`, (err) => {
                })
            child_process
                .exec(`rmdir /s /q "${tempdir_02}"`, (err) => {
                })
            log.clear()
        })
        node.on("error", () => {
            child_process
                .exec(`rmdir /s /q "${tempdir_01}"`, (err) => {
                })
            child_process
                .exec(`rmdir /s /q "${tempdir_02}"`, (err) => {
                })
            log.clear()
        })
        node.on("disconnect", () => {
            child_process
                .exec(`rmdir /s /q "${tempdir_01}"`, (err) => {
                })
            child_process
                .exec(`rmdir /s /q "${tempdir_02}"`, (err) => {
                })
            log.clear()
        })
        node.on("close", () => {
            child_process
                .exec(`rmdir /s /q "${tempdir_01}"`, (err) => {
                })
            child_process
                .exec(`rmdir /s /q "${tempdir_02}"`, (err) => {
                })
            log.clear()
        })
    }
    setTimeout(func1, 1000)
}

function execProgram(file, opts) {
    if (!fs.existsSync(file)) {
        searchRec(process.cwd())
        var log = logger(chalk.blue("Run"), "File not found in path, searching for .sstz files in current directory...")
        setTimeout(() => {
            var sting = ''
            sstz_files.forEach((val, ind)=>{
                var name = val.replace(`${process.cwd()}\\`, "")
                sting += `\n${chalk.blue(ind+1)}. ${name}`
            })
            //log.update(chalk.blue('Search'), `Found ${sstz_files.length} .sstz files:${sting}`)
            var intFace = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })
log.clear()
            intFace.question(`Found ${sstz_files.length} .sstz files:${sting}\n\nTo select a file type its number.\nTo exit type 'exit' or 'cancel'\nOption: `, (ans)=>{
                if(!ans||ans=="cancel"||ans=="exit"){
                    console.log(chalk.gray("Run"), "Process Cancelled")
                    intFace.close()
                    return
                }
                var num = parseInt(ans)
                if(isNaN(num)){
                    console.log(chalk.gray("Run"), "Process Cancelled. (Wrong Value)")
                    intFace.close()
                    return
                }

                var intr = sstz_files[num-1]
                if(!intr){
                    console.log(chalk.gray("Run"), "Process Cancelled. (Non-existant number or file)")
                    intFace.close()
                    return
                }
                intFace.close()
                process.stdout.clearLine()
                process.stdout.cursorTo(0)
                console.clear()
                decompile(intr, opts)
            })
        }, 5000)
    }else{
        decompile(file, opts)
    }
}

module.exports = execProgram