const {readArticles, readArticleById} = require("../models/articles-models")

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