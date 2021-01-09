const createError = require('http-errors')
const Joi = require('joi')
const JoiPhone = require('joi-phone-number')
const ash = require('express-async-handler')

const schemes = new Object()

schemes.registration = Joi.object({
    phone: Joi.extend(JoiPhone)
        .string()
        .phoneNumber({ defaultCountry: 'UA', strict: true }),

    name: Joi.string()
        .pattern(new RegExp('^[A-Za-z]+$'))
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,18}$'))
        .required()
})

schemes.login = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,18}$'))
        .required()
})

schemes.searchUsers = Joi.object({
    name: Joi.string()
        .pattern(new RegExp('^[A-Za-z]+$')),

    email: Joi.string()
        .email()

}).or('name', 'email')

schemes.searchItems = Joi.object({
    title: Joi.string(),

    user_id: Joi.number(),

    order_by: Joi.string()
        .valid('price')
        .valid('created_at')
        .default('created_at'),

    order_type: Joi.string()
        .valid('asc')
        .valid('desc')
        .default('desc')
})

schemes.itemUpdate = Joi.object({
    title: Joi.string(),
    price: Joi.number()

}).or('title', 'price')

schemes.userUpdate = Joi.object({
    phone: Joi.extend(JoiPhone)
        .string()
        .phoneNumber({ defaultCountry: 'UA', strict: true }),

    name: Joi.string()
        .pattern(new RegExp('^[A-Za-z]+$')),

    email: Joi.string()
        .email(),

    current_password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,18}$')),

    new_password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,18}$'))
        .when('current_password', {is: Joi.exist(), then: Joi.required()})

}).or('phone', 'name', 'email', 'current_password')

schemes.itemCreate = Joi.object({
    title: Joi.string()
        .required(),
        
    price: Joi.number()
        .required()
})

exports.validateRegistration = ash(async function(req, res, next) {
    try {
        req.validData = await schemes.registration.validateAsync(req.body)
        next()

    } catch (error) {
        if (error.details[0].type == 'string.email') {
            let newError = new createError.UnprocessableEntity(error.details[0].message)
            newError.field = 'email'
            throw newError

        } else if (error.details[0].type == 'string.phone') {
            let newError = new createError.UnprocessableEntity(error.details[0].message)
            newError.field = 'phone'
            throw newError

        } else {
            throw new createError.UnprocessableEntity(error.details[0].message)
        }
    }
})

exports.validateLogin = ash(async function(req, res, next) {
    try {
        req.validData = await schemes.login.validateAsync(req.body)
        next()

    } catch (error) {
        if (error.details[0].type == 'string.email') {
            let newError = new createError.UnprocessableEntity(error.details[0].message)
            newError.field = 'email'
            throw newError

        } else {
            throw new createError.UnprocessableEntity(error.details[0].message)
        }
    }
})

exports.validateUserUpdate = ash(async function(req, res, next) {
    try {
        req.validData = await schemes.userUpdate.validateAsync(req.body)
        next()

    } catch (error) {
        if (error.details[0].type == 'string.email') {
            let newError = new createError.UnprocessableEntity(error.details[0].message)
            newError.field = 'email'
            throw newError

        } else if (error.details[0].type == 'string.phone') {
            let newError = new createError.UnprocessableEntity(error.details[0].message)
            newError.field = 'phone'
            throw newError

        } else {
            throw new createError.UnprocessableEntity(error.details[0].message)
        }
    }
})

exports.validateItemUpdate = ash(async function(req, res, next) {
    try {
        req.validData = await schemes.itemUpdate.validateAsync(req.body)
        next()

    } catch (error) {
        throw new createError.UnprocessableEntity(error.details[0].message)
    }
})

exports.validateSearchUsers = ash(async function(req, res, next) {
    try {
        req.validData = await schemes.searchUsers.validateAsync(req.query)
        next()

    } catch (error) {
        console.log(error)
        throw new createError.UnprocessableEntity(error.details[0].message)
    }
})

exports.validateSearchItems = ash(async function(req, res, next) {
    try {
        req.validData = await schemes.searchItems.validateAsync(req.query)
        next()

    } catch (error) {
        throw new createError.UnprocessableEntity(error.details[0].message)
    }
})

exports.validateItemCreate = ash(async function(req, res, next) {
    try {
        req.validData = await schemes.itemCreate.validateAsync(req.body)
        next()

    } catch (error) {
        throw new createError.UnprocessableEntity(error.details[0].message)
    }
})