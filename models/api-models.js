const fs = require("fs/promises")

exports.readApiDetails = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
        return JSON.parse(data)
    })
}