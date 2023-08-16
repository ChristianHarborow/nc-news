const {readArticles, readArticleById, updateArticleById} = require("../models/articles-models")

exports.getArticles = (req, res, next) => {
    readArticles().then((rows) => {
        res.status(200).send({articles: rows})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params 

    readArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body

    Promise.all([
        updateArticleById(article_id, inc_votes),
        readArticleById(article_id)
    ])
    .then((data) => {
        res.status(200).send({article: data[0]})
    })
    .catch((err) => {
        next(err)
    })
}