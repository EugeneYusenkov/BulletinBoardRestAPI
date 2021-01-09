const controller = require('../controllers/sessions')
const validator = require('../validator')

const express = require('express')
const router = express.Router()

router
    .route('/')
    .post(validator.validateLogin, controller.loginUser)

module.exports = router