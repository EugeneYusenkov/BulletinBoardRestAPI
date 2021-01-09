const config = require('../config')
const dbHandler = require('../dbHandler')
const crypt = require('../cryptographer')
const auth = require('../auth')

const createError = require('http-errors')
const ash = require('express-async-handler')

exports.registerUser = ash(async function(req, res) {
    let user = await dbHandler.getUser({email: req.validData.email})
    if (user) {
        throw new createError.Conflict('This email is already in use')
    }

    let hash = await crypt.hashPassword(req.validData.password)

    req.validData.phone = req.validData.phone || ''
    req.validData.password = hash

    let result = await dbHandler.insertUser(req.validData)
    let token = await auth.generateToken({id: result[0].insertId})

    res.status(config.status.Success)
    res.json({token: token})
})

exports.authUser = ash(async function (req, res) {
    delete req.user.password

    res.status(config.status.Success)
    res.json(req.user)
})

exports.updateUser = ash(async function(req, res) {
    if (req.body.current_password) {

        let isEqual = await crypt.comparePassword(req.body.current_password, req.user.password)  
        if (!isEqual) {
            let error = new createError.UnprocessableEntity('Wrong password')
            error.field = 'password'
            throw error
        }

        req.body.password = await crypt.hashPassword(req.body.new_password)
        delete req.body.current_password
    }

    if (req.body.new_password) {
        delete req.body.new_password
    }

    await dbHandler.updateUser(req.body, {id: req.user.id})

    let updatedUser = await dbHandler.getUser({id: req.user.id})
    if (!updatedUser) {      
        throw new createError.NotFound('Not found user with this id')
    }

    res.status(config.status.Success)
    res.json({
        id: updatedUser.id,
        phone: updatedUser.phone,
        name: updatedUser.name,
        email: updatedUser.email
    })
})

exports.getUserByID = ash(async function(req, res) {
    let user = await dbHandler.getUser({id: req.params.id})
    if (!user) {
        throw new createError.NotFound('Not found user with this id')
    }

    res.status(config.status.Success)
    res.json({
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email
    })
})

exports.searchUsers = ash(async function(req, res) {
    let users = await dbHandler.searchUsers(req.validData)
    if (!users.length) {
        throw new createError.NotFound('Not found any user with this params')
    }
    
    for (const user of users) {
        delete user.password
    }

    res.status(config.status.Success)
    res.json(users)
})