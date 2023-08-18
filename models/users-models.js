const db = require("../db/connection")

exports.readUsers = () => {
    return db.query(`
        SELECT * FROM users
    `)
    .then(({rows}) => {
        return rows
    })
}

exports.readUserByUsername = (username) => {
    return db.query(`
        SELECT * FROM users
        WHERE username = $1
    `, [username])
    .then(({rows}) => {
        if(rows[0]) return rows[0]
        return Promise.reject({status: 404, msg: "User not found"})
    })
}