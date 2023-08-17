const db = require("../db/connection")

exports.readTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

exports.topicExists = (slug) => {
    return db.query(`
        SELECT * FROM topics
        WHERE slug = $1
    `, [slug])
    .then(({rows}) => {
        if (!rows[0]) return Promise.reject({status: 404, msg: "Topic not found"})
    })
}