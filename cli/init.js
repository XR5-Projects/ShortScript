const fs = require("graceful-fs")
const chlk = require("chalk")
const dataInt = require("./lib/data")
const pathMod = require("node:path")
const tempCleaner = require("./lib/temp-cleaner")

var chalk = chlk
function generateString(length) {
    var characters = "123456789012345678900987654321abcdefghijklmnopqrstuvwxyzZYXWVUTSRQPONMLKJIHGFEDCBA23456789012345678900987654313579246810"
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
function loger(task, msg) {
    process.stdout.write(`${task} : ${msg} `)
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
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

            if (dInt < 0) {
                return true
            } else {
                return false
            }
        }
    }
}

function init(path) {
    tempCleaner()
    var pkgjson_path = pathMod.join(path, "package.json")

    var folder_name = path.split("\\")[
        parseInt(path.split("\\").length) - 1
    ]
    var pgk = projectId(generateString(50))

    try {
        if(!fs.existsSync("./out")){
            fs.mkdirSync("./out")
        }
        if (!fs.existsSync(pkgjson_path)) {
            fs.writeFileSync(pkgjson_path, JSON.stringify({
                "name": folder_name,
                "version": "1.0.0",
                "description": "",
                "main": "index.js",
                "scripts": {
                    "test": "echo \"Error: no test specified\" && exit 1"
                },
                "author": process.env.USERNAME,
                "license": "ISC",
                "sstConfig": {
                    "compileType": "sstz",
                    "keySign": pgk.id,
                    "ignore": [
                        "out"
                    ]
                }
            }
                , null, 3))
            loger(chalk.bgWhite(chalk.blue("Initiaising")), "Creating package.json..")
        } else {
            var pkgjson = require(pkgjson_path)
            pkgjson.sstConfig = {
                keySign: pgk.id,
                ignore: [
                    "out"
                ]
            }
            fs.writeFileSync(pkgjson_path, JSON.stringify(pkgjson, null, 3))
        }
        pgk.save(path)
        console.log(chalk.bgWhite(chalk.green("Done")) + " : " + "Completed initialisation.")
    } catch (err) {
        console.log(chalk.bgWhite(chalk.red("Error")) + " : " + err)
    }
}

module.exports = init