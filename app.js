const apiRouter = require("./routes/api-router")
const {handleCustomErrors, handleSqlErrors, handleServerErrors} = require("./error-handlers")
const express = require("express")
const cors = require('cors');

const app = express()

app.use(cors())

app.use(express.json())

app.use("/api", apiRouter)

app.use((req, res) => {
    res.status(404).send({msg: "Not found"})
})

app.use(handleCustomErrors)
app.use(handleSqlErrors)
app.use(handleServerErrors)

module.exports = app