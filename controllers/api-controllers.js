const {readApiDetails} = require("../models/api-models")

exports.getApiDetails = (req, res, next) => {
    readApiDetails().then((details) => {
        res.status(200).send({api: details})
    })
    .catch((err) => {
        next(err)
    })
}