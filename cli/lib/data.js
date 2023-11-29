const fs = require("node:fs"),
    cryjs = require("./crypt")
var datapath = `${process.env.APPDATA}/sst_npm`

function check() {
        if (!fs.existsSync(datapath)) {
            fs.mkdirSync(datapath)
        }
}

function writedata(name, data) {
    check()
    var path = `${datapath}/${name}.xrd`
    var data1 = JSON.stringify({
        name: name,
        created_at: new Date(),
        data: data
    })
    var se = cryjs.encryptText(data1, `${process.env.HOMEPATH}`).data
    fs.writeFileSync(path, se)
}

function readdata(name) {
    var path = `${datapath}/${name}.xrd`
    if (fs.existsSync(path)) {
        var sd = fs.readFileSync(path, { encoding: "utf8" })
        var btyr = cryjs.decryptText(sd, `${process.env.HOMEPATH}`).data
        return JSON.parse(btyr)
    } else {
        writedata(name, [])
        return readdata(name)
    }
}

module.exports = {
    readdata: readdata,
    writedata: writedata,
    dir: datapath
}