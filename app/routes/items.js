const controller = require('../controllers/items')
const validator = require('../validator')
const auth = require('../auth')

const express = require('express')
const router = express.Router()

router
    .route('/')
    .get(validator.validateSearchItems, controller.searchItems)
    .post(auth.authToken, validator.validateItemCreate, controller.createItem)

router
    .route('/:id')
    .get(controller.getItemByID)
    .put(auth.authToken, validator.validateItemUpdate, controller.updateItem)
    .delete(auth.authToken, controller.deleteItem)

router
    .route('/:id/image')
    .post(auth.authToken, controller.uploadImage)
    .delete(auth.authToken, controller.deleteImage)

module.exports = router