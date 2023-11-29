const { existsSync, readFileSync, writeFileSync, unlinkSync } = require("fs")
const { join } = require("path")
const dataOne = require("./coverter")


function requireScript(name, options) {
    var root = process.cwd()
    var dir = join(root, `${name}.sst`)
    var out = join(root, `${name}.js`)
    if (!existsSync(dir)) {
        console.error(`Error: ${name}.sst file was not found.`)
        process.exit()
    } else {
        var data1 = readFileSync(dir, { encoding: "utf8" })
        var s1 = dataOne(data1)
        writeFileSync(out, s1)

        process.on("SIGQUIT", () => {
            unlinkSync(out)
        })
        process.on("exit", () => {
            unlinkSync(out)
        })
        return require(`${root}/${name}`)
    }
}

module.exports = {
    requireScript: requireScript
}
