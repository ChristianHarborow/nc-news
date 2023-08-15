const {getTopics} = require("./controllers/topics-controllers")
const {getApiDetails} = require("./controllers/api-controllers")
const {getArticles, getArticleById, patchArticleById} = require("./controllers/articles-controllers")
const {getCommentsByArticleId} = require("./controllers/comments-controllers")
const {handleCustomErrors, handleSqlErrors, handleServerErrors} = require("./error-handlers")
const express = require("express")

const app = express()

app.use(express.json())

app.get("/api", getApiDetails)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)
app.patch("/api/articles/:article_id", patchArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.use((req, res) => {
    res.status(404).send({msg: "Not found"})
})

app.use(handleCustomErrors)
app.use(handleSqlErrors)
app.use(handleServerErrors)

module.exports = app