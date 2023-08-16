const db = require("../db/connection")

exports.readCommentsByArticleId = (articleId) => {
    return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1
    `, [articleId])
    .then(({rows}) => {
        return rows
    })
}

exports.insertComment = (articleId, {author, body}) => {
    return db.query(`
        INSERT INTO comments
        (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *
    `, [articleId, author, body])
    .then(({rows}) => {
        return rows[0]
    })
}