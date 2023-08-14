const {readTopics} = require("../models/topics-models")

exports.getTopics = (req, res, next) => {
    readTopics().then((rows) => {
        res.status(200).send({topics: rows})
    })
    .catch((err) => {
        next(err)
    })
}