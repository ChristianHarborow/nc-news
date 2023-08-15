exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status) {
        res.status(err.status).send({msg: err.msg})
    }
    else {
        next(err)
    }
}

exports.handleSqlErrors = (err, req, res, next) => {
    if(['22P02', '23502'].includes(err.code)) {
        res.status(400).send({msg: 'Bad request'})
    }
    else {
        next(err)
    }
}

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
}