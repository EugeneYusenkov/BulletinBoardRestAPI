const config = require('../config')
const dbHandler = require('../dbHandler')
const crypt = require('../cryptographer')
const auth = require('../auth')

const createError = require('http-errors')
const ash = require('express-async-handler')

exports.loginUser = ash(async function(req, res) {
    let user = await dbHandler.getUser({email: req.validData.email})

    if (!user) {
        let error = new createError.UnprocessableEntity(`User with this email doesn't exist`)
        error.field = 'email'
        throw error
    }

    let isEqual = await crypt.comparePassword(req.validData.password, user.password)
    if (!isEqual) {
        let error = new createError.UnprocessableEntity('Wrong password')
        error.field = 'password'
        throw error
    }

    let token = await auth.generateToken(user)

    res.status(config.status.Success)
    res.json({token: token})
})