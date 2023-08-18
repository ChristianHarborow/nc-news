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

exports.destroyComment = (commentId) => {
    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
    `, [commentId])
}

exports.commentExists = (comment_id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE comment_id = $1
    `, [comment_id])
    .then(({rows}) => {
        if (!rows[0]) {
            return Promise.reject({status: 404, msg: "Comment not found"})
        }
    })
}

exports.updateComment = (incVotes, commentId) => {
    return db.query(`
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *
    `, [incVotes, commentId])
    .then(({rows}) => {
        if(rows[0]) return rows[0]
        return Promise.reject({status: 404, msg: "Comment not found"})
    })
}