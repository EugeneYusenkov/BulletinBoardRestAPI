const bcrypt = require('bcrypt')
const saltRounds = 10

exports.hashPassword = async function(password) {
    try {
        return await bcrypt.hash(password, saltRounds)

    } catch (error) { throw error }
}

exports.comparePassword = async function(password, hash) {
    try {
        return await bcrypt.compare(password, hash)

    } catch (error) { throw error }
}