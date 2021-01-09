const config = require('../config')
const multer = require('multer')
const path = require('path')
const moment = require('moment')

const dateFormat = 'DDMMYYYY-HHmmss_'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./' + config.app.imagesDirLocal))
    },
    
    filename: function (req, file, cb) {
        cb(null, moment().format(dateFormat) + file.originalname)
    }
})

const upload = multer({storage: storage})

module.exports = upload