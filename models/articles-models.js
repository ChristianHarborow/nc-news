const db = require("../db/connection")

exports.readArticles = (topic, sortBy="created_at", order="desc") => {
    let queryString = `
        SELECT 
            articles.author, title, articles.article_id, topic, articles.created_at,
            articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments
            ON articles.article_id = comments.article_id
    `

    const conditions = []
    const queryValues = []

    if (topic) {
        conditions.push("topic = $1")
        queryValues.push(topic)
    }

    if (conditions.length) {
        queryString += " WHERE " + conditions.join(" AND ")
    }

    queryString += ` GROUP BY articles.article_id `

    const fields = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"]
    
    if (!fields.includes(sortBy) || !['asc', 'desc'].includes(order)) {
        return Promise.reject({status: 400, msg: "Bad request"})
    }

    const specifier = sortBy !== "comment_count" ? "articles." : ""
    queryString += ` ORDER BY ${specifier}${sortBy} ${order}`
    
    return db.query(queryString, queryValues)
    .then(({rows}) => {
        return rows
    })
}

exports.readArticleById = (articleId) => {
    return db.query(`
        SELECT 
            articles.author, title, articles.body, articles.article_id, topic, articles.created_at,
            articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments
            ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id
    `, [articleId])
    .then(({rows}) => {
        if (rows[0]) return rows[0]
        else return Promise.reject({status: 404, msg: "Article not found"})
    })
}

exports.updateArticleById = (article_id, inc_votes) => {
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *
    `, [inc_votes, article_id])
    .then(({rows}) => {
        return rows[0]
    })
}