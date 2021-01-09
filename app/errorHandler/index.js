const httpErrors = require('http-errors')

const config = require('../config')

exports.errorLog = function(error, req, res, next) {
    console.error(error)
    if (next) {
        next(error)
    }
}

exports.handleHttpError = function(error, req, res, next) {
    if (httpErrors.isHttpError(error)) {
        res.status(error.status)
        res.json(error)

    } else {
        if (next) {
            next(error)
        }
    }
}

exports.handleOtherError = function(error, req, res, next) {
    res.sendStatus(config.status.InternalServerError)
}