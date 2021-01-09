const dbHandler = require('../dbHandler')

const ash = require('express-async-handler')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const path = require('path')
const fs = require('fs')
const jwtPrivateKey = fs.readFileSync(path.resolve(__dirname, 'jwt.pkey'))

exports.authToken = ash(async function(req, res, next) {
    try {
        let {userID} = jwt.verify(req.headers.authorization, jwtPrivateKey)
        if (!userID) {
            throw new createError.Unauthorized()
        }

        let user = await dbHandler.getUser({id: userID})
        if (!user) {
            throw new createError.Unauthorized()
        }

        console.log(user)
        req.user = user
        next()

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new createError.Unauthorized()

        } else {
            throw error
        }
    } 
})

exports.generateToken = async function(user) {
    try {
        let payload = { userID: user.id }
        let token = jwt.sign(payload, jwtPrivateKey, { expiresIn: '1h' })

        return token

    } catch (error) {
        throw error
    }
}