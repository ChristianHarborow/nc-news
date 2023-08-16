const {readCommentsByArticleId, insertComment, destroyComment, commentExists} = require("../models/comments-models")
const {readArticleById} = require("../models/articles-models")

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params

    Promise.all([
        readCommentsByArticleId(article_id),
        readArticleById(article_id)
    ])
    .then((data) => {
        res.status(200).send({comments: data[0]})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    const {body} = req
    const {article_id} = req.params

    insertComment(article_id, body).then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    
    Promise.all([
        commentExists(comment_id),
        destroyComment(comment_id)
    ])
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}