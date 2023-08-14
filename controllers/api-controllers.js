const api = require("../endpoints.json")

exports.getApiDetails = (req, res, next) => {
    res.status(200).send({api})
}