const cryjs = require("crypto-js")
const fs = require("node:fs")

function decryptFile(path, pass) {
    try {
        var sd = fs.readFileSync(path, { encoding: "utf8" })
        var btyr = cryjs.DES.decrypt(atob(sd), pass)
        var dir = btyr.toString(cryjs.enc.Utf8)
        var bt = cryjs.AES.decrypt(dir, pass)
        var di = bt.toString(cryjs.enc.Utf8)

        if (!di || di == undefined) {
            return {
                status: "failed",
                reason: "Unknown"
            }
        } else {
            return {
                status: "success",
                reason: "decrypted file",
                data: di
            }
        }
    } catch (err) {
        return {
            status: "failed",
            reason: err
        }
    }
}

function encryptFile(path, data, pass) {
    try {
        var cj = cryjs.AES.encrypt(data, pass).toString()
        var se = cryjs.DES.encrypt(cj, pass).toString()
        fs.writeFileSync(path, btoa(se))
        return {
            status: "success",
            reason: "Encrypted Successfully."
        }
    } catch (err) {
        return {
            status: "failed",
            reason: err
        }
    }
}

function decryptText(data, pass) {
    try {
        var sd = data
        var btyr = cryjs.DES.decrypt(atob(sd), pass)
        var dir = btyr.toString(cryjs.enc.Utf8)
        var bt = cryjs.AES.decrypt(dir, pass)
        var di = bt.toString(cryjs.enc.Utf8)

        if (!di || di == undefined) {
            return {
                status: "failed",
                reason: "Unknown"
            }
        } else {
            return {
                status: "success",
                reason: "decrypted file",
                data: di
            }
        }
    } catch (err) {
        return {
            status: "failed",
            reason: err
        }
    }
}

function encryptText(data, pass) {
    try {
        var cj = cryjs.AES.encrypt(data, pass).toString()
        var se = cryjs.DES.encrypt(cj, pass).toString()
        return {
            status: "success",
            reason: "Encrypted Successfully.",
            data: btoa(se)
        }
    } catch (err) {
        return {
            status: "failed",
            reason: err
        }
    }
}

module.exports = {
    encryptFile: encryptFile,
    decryptFile: decryptFile,
    encryptText: encryptText,
    decryptText: decryptText
}