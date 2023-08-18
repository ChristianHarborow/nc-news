const {getApiDetails} = require("../controllers/api-controllers")
const articlesRouter = require("./articles-router")
const topicsRouter = require("./topics-router")
const commentsRouter = require("./comments-router")
const usersRouter = require("./users-router")
const apiRouter = require('express').Router()


apiRouter.get('/', getApiDetails)

apiRouter.use('/articles', articlesRouter)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/comments', commentsRouter)
apiRouter.use('/users', usersRouter)

module.exports = apiRouter