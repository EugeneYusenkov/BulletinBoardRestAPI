const fs = require('fs')
const path = require('path')
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json')))

config.app.appDir = path.resolve(__dirname, '..\\..\\')

config.getImagePathLocal = function(filename) {
    return path.resolve(config.app.appDir, config.app.imagesDirLocal, filename)
}

config.getImagePathPublic = function(filename) {
    return `${config.app.protocol}://${config.app.hostname}:${config.app.port}/${config.app.imagesDirPublic}/${filename}`
}

module.exports = config