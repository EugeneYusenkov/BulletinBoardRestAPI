const config = require('../config')

const mysql = require('mysql2')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.app.hostname,
    user: config.mysql.user,
    database: config.mysql.database,
    password: config.mysql.password
}).promise()

exports.getUser = async function(params) {
    try {
        let sql = 'select * from users where ?'
        let result = await pool.query(sql, params)        
        return result[0][0]

    } catch (error) { throw error }
}

exports.insertUser = async function(params) {
    try {
        let sql = 'insert into users set ?'
        return await pool.query(sql, params)

    } catch (error) { throw error }
}

exports.updateUser = async function(params, byParam) {
    try {
        return await pool.query('update users set ? where ?', [params, byParam])

    } catch (error) { throw error }
}

exports.searchUsers = async function(params) {
    try {
        let rawSql = 'select * from users where '
        for (const key in params) {
            rawSql += `${key} = '${params[key]}' and `
        }

        let sql = rawSql.slice(0, rawSql.length - 4)
        let result = await pool.query(sql)
        return result[0]

    } catch (error) { throw error }
}

exports.searchItemsWithOrderBy = async function(params, orderBy, orderType) {
    try {
        let rawSql = 'select * from items where '
        for (const key in params) {
            rawSql += `${key} = '${params[key]}' and `
        }
        let sql = rawSql.slice(0, rawSql.length - 4)
        
        sql += ` order by ${orderBy} ${orderType}`

        let result = await pool.query(sql)
        return result[0]

    } catch (error) { throw error }
}

exports.searchItems = async function(params) {
    try {
        let rawSql = 'select * from items where '
        for (const key in params) {
            rawSql += `${key} = '${params[key]}' and `
        }
        let sql = rawSql.slice(0, rawSql.length - 4)

        let result = await pool.query(sql)
        return result[0]

    } catch (error) { throw error }
}

exports.getItem = async function(params) {
    try {
        let sql = 'select * from items where ?'
        let result = await pool.query(sql, params)        
        return result[0][0]

    } catch (error) { throw error }
}

exports.setItemImage = async function(imagePath, byParam) {
    try {
        return await pool.query('update items set image = ? where ?', [imagePath, byParam])

    } catch (error) { throw error }
}

exports.updateItem = async function(params, byParam) {
    try {
        return await pool.query('update items set ? where ?', [params, byParam])

    } catch (error) { throw error }
}

exports.deleteItem = async function(byParam) {
    try {
        return await pool.query('delete from items where ?', byParam)

    } catch (error) { throw error }
}

exports.insertItem = async function(params) {
    try {
        let sql = 'insert into items set ?'
        return await pool.query(sql, params)

    } catch (error) { throw error }
}