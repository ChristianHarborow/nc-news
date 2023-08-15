const {readCommentsByArticleId} = require("../models/comments-models")
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