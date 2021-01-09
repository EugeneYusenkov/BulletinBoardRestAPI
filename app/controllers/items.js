const config = require('../config')
const dbHandler = require('../dbHandler')
const upload = require('../uploader')
const errorHandler = require('../errorHandler')

const createError = require('http-errors')
const ash = require('express-async-handler')
const path = require('path')
const fs = require('fs/promises')

exports.createItem = ash(async function (req, res) {
    let items = await dbHandler.searchItems({user_id: req.user.id, title: req.validData.title})

    if (items.length) {
        throw new createError.Conflict('Your item with same title is exists')
    }

    let item = req.validData

    item.created_at = Date.now()
    item.user_id = req.user.id
    item.image = ''

    let result = await dbHandler.insertItem(item)
    let createdItem = await dbHandler.getItem({id: result[0].insertId})

    createdItem.user = {
        id: req.user.id,
        phone: req.user.phone,
        name: req.user.name,
        email: req.user.email
    }
    
    res.status(config.status.Success)
    res.json(createdItem)
})

exports.searchItems = ash(async function(req, res) {
    let searchArgs = new Object()

    Object.assign(searchArgs, req.validData)
    delete searchArgs.order_by
    delete searchArgs.order_type
    
    let items = await dbHandler.searchItemsWithOrderBy(searchArgs, req.validData.order_by, req.validData.order_type)

    if (!items.length) {
        throw new createError.NotFound('Not found any item with this params')
    }

    if (req.validData.hasOwnProperty('user_id')) {
        let user = await dbHandler.getUser({id: req.validData.user_id})
        let itemUser = {
            id: user.id,
            phone: user.phone,
            name: user.name,
            email: user.email
        }

        for (const item of items) {
            item.user = itemUser
        }

    } else {
        for (const item of items) {
            let user = await dbHandler.getUser({id: item.user_id})
            item.user = {
                id: user.id,
                phone: user.phone,
                name: user.name,
                email: user.email
            }
        }
    }

    res.status(config.status.Success)
    res.json(items)
})

exports.uploadImage = ash(async function(req, res) {
    let item = await dbHandler.getItem({id: req.params.id})

    if (!item) {
        throw new createError.NotFound('Not found any item with this id')
    }

    if (item.user_id !== req.user.id) {
        throw new createError.Unauthorized(`You can't upload image to not your item`)
    }

    if (item.image) {
        throw new createError.Conflict('Item is already have an image')
    }

    upload.single('image')(req, res, async (error) => {
        if (req.file) {
            if (!error) {
                try {
                    let pathToFile = config.getImagePathPublic(req.file.filename) 

                    await dbHandler.setItemImage(pathToFile, {id: req.params.id})
                    let item = await dbHandler.getItem({id: req.params.id})

                    delete req.user.password

                    item.user = req.user
                    
                    res.status(config.status.Success)
                    res.json(item)
    
                } catch (error) {
                    errorHandler.errorLog(error, req, res)
                    errorHandler.handleOtherError(error, req, res)
                }
            } else {
                errorHandler.errorLog(error, req, res)
                errorHandler.handleOtherError(error, req, res)
            }

        } else {
            let error = new createError.InternalServerError()
            errorHandler.errorLog(error, req, res)
            errorHandler.handleOtherError(error, req, res)
        }
    })
})

exports.getItemByID = ash(async function(req, res) {
    let item = await dbHandler.getItem({id: req.params.id})

    if (!item) {
        throw new createError.NotFound('Not found any item with this id')
    }

    let user = await dbHandler.getUser({id: item.user_id})
    if (user) {
        item.user = {
            id: user.id,
            phone: user.phone,
            name: user.name,
            email: user.email
        }
    } else {
        item.user = 'Not found user with this id'
    }

    res.status(config.status.Success)
    res.json(item)
})

exports.updateItem = ash(async function(req, res) {
    let item = await dbHandler.getItem({id: req.params.id})

    if (item.user_id !== req.user.id) {
        throw new createError.Unauthorized(`You can't update not your item`)
    }

    await dbHandler.updateItem(req.body, {id: req.params.id})
    let updatedItem = await dbHandler.getItem({id: req.params.id})

    updatedItem.user = {
        id: req.user.id,
        phone: req.user.phone,
        name: req.user.name,
        email: req.user.email
    }

    res.status(config.status.Success)
    res.json(updatedItem)
})

exports.deleteItem = ash(async function(req, res) {
    let item = await dbHandler.getItem({id: req.params.id})

    if (!item) {
        throw new createError.NotFound(`Not found any item with this id`)
    }

    if (item.user_id !== req.user.id) {
        throw new createError.Unauthorized(`You can't delete not your item`)  
    }

    if (item.image) {
        let filename = path.basename(item.image)
        let pathToFile = config.getImagePathLocal(filename)

        try {
            await dbHandler.setItemImage('', {id: req.params.id})
            await fs.unlink(pathToFile)

        } catch (error) {
            if (error.code == 'ENOENT') {
                throw new createError.NotFound(`This item doesn't have an image`)

            } else {
                throw error
            }
        }
    }

    await dbHandler.deleteItem({id: req.params.id})    
    res.status(config.status.Success)
    res.json({message: `Item with id = ${req.params.id} was deleted`})
})

exports.deleteImage = ash(async function(req, res) {
    let item = await dbHandler.getItem({id: req.params.id})

    if (item.user_id !== req.user.id) {
        throw new createError.Unauthorized(`You can't delete image of not your item`)
    }

    if (!item.image) {
        throw new createError.NotFound(`This item doesn't have an image`)
    }

    let filename = path.basename(item.image)
    let pathToFile = config.getImagePathLocal(filename)

    try {
        await dbHandler.setItemImage('', {id: req.params.id})
        await fs.unlink(pathToFile)

        res.sendStatus(config.status.Success)
        
    } catch (error) {
        if (error.code == 'ENOENT') {
            throw new createError.NotFound(`This item doesn't have an image`)

        } else {
            throw error
        }
    }
})