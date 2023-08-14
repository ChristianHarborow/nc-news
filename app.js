const {getTopics} = require("./controllers/topics-controllers")
const {getApiDetails} = require("./controllers/api-controllers")
const {getArticleById} = require("./controllers/articles-controllers")
const {handleCustomErrors, handleSqlErrors, handleServerErrors} = require("./error-handlers")
const express = require("express")

const app = express()

app.use(express.json())

app.get("/api", getApiDetails)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.use(handleCustomErrors)
app.use(handleSqlErrors)
app.use(handleServerErrors)

module.exports = app