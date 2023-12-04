const [
    child_process,
    dataInt,
    fs,
    path
] = [
        require("node:child_process"),
        require("./data"),
        require("node:fs"),
        require("node:path")
    ]

module.exports = () => {
    try {
        var temp1 = path.join(dataInt.dir, "temp")
        var temp2 = path.join(dataInt.dir, "temp_01")

        const temp1C = () => {
            if (fs.existsSync(temp1)) {
                fs.readdirSync(temp1)
                    .forEach((value) => {
                        var src = path.join(temp1, value)
                        const exist = fs.existsSync(src)
    
                        if (exist) {
    
                            const isDir = fs.statSync(src).isDirectory()
                            if (isDir) {
                                var dpl = child_process
                                    .exec(`rmdir /s /q "${src}"`, () => { dpl.on("message", () => { dpl.kill("SIGKILL") }) })
    
                            } else {
                                var dpl = child_process
                                    .exec(`del /f "${src}"`, () => { dpl.on("message", () => { dpl.kill("SIGKILL") }) })
    
                            }
                        }
                    })
            }
        }
        const temp2C = () => {
            if (fs.existsSync(temp2)) {
                fs.readdirSync(temp2)
                    .forEach((value) => {
                        var src = path.join(temp2, value)
                        const exist = fs.existsSync(src)
    
                        if (exist) {
    
                            const isDir = fs.statSync(src).isDirectory()
                            if (isDir) {
                                var dpl = child_process
                                    .exec(`rmdir /s /q "${src}"`, () => { dpl.on("message", () => { dpl.kill("SIGKILL") }) })
    
                            } else {
                                var dpl = child_process
                                    .exec(`del /f "${src}"`, () => { dpl.on("message", () => { dpl.kill("SIGKILL") }) })
    
                            }
                        }
                    })
            }
        }

        temp1C()
        temp2C()
    } catch (e) {
        console.log(e)
    }
}