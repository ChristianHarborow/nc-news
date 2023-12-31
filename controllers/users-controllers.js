const {readUsers, readUserByUsername} = require("../models/users-models")

exports.getUsers = (req, res, next) => {
    readUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUserByUsername = (req, res, next) => {
    const {username} = req.params

    readUserByUsername(username).then((user) => {
        res.status(200).send({user})
    })
    .catch((err) => {
        next(err)
    })
}