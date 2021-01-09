const controller = require('../controllers/users')
const validator = require('../validator')
const auth = require('../auth')

const express = require('express')
const router = express.Router()

router
    .route('/')
    .post(validator.validateRegistration, controller.registerUser)
    .get(validator.validateSearchUsers, controller.searchUsers)

router
    .route('/me')
    .get(auth.authToken, controller.authUser)
    .put(auth.authToken, validator.validateUserUpdate, controller.updateUser)

router
    .route('/:id')
    .get(auth.authToken, controller.getUserByID)

module.exports = router