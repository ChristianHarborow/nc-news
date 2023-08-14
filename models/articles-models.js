const db = require("../db/connection")

exports.readArticleById = (articleId) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1
    `, [articleId])
    .then(({rows}) => {
        if (rows[0]) return rows[0]
        else return Promise.reject({status: 404, msg: "Article not found"})
    })
}