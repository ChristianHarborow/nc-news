const db = require("../db/connection")

exports.readArticles = () => {
    return db.query(`
        SELECT 
            articles.author, title, articles.article_id, topic, articles.created_at,
            articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments
            ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC
    `)
    .then(({rows}) => {
        return rows
    })
}

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