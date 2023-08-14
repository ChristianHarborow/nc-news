const {readArticleById} = require("../models/articles-models")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params 

    readArticleById(article_id).then((article) => {
        if (article) res.status(200).send({article})
        else next({status: 404, msg: "Article not found"})
    })
    .catch((err) => {
        next(err)
    })
}