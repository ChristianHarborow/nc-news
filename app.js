const {getTopics} = require("./controllers/topics-controllers")
const {getApiDetails} = require("./controllers/api-controllers")
const {handleServerErrors} = require("./error-handlers")
const express = require("express")

const app = express()

app.get("/api", getApiDetails)

app.get("/api/topics", getTopics)

app.use(handleServerErrors)

module.exports = app