const config = require('./config')
const errorHandler = require('./errorHandler')

const express = require('express')
const app = express()

const usersRouter = require('./routes/users')
const sessionsRouter = require('./routes/sessions')
const itemsRouter = require('./routes/items')

app.use(express.static(config.app.publicDir))

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/items', itemsRouter)

app.use(errorHandler.errorLog)
app.use(errorHandler.handleHttpError)
app.use(errorHandler.handleOtherError)

app.listen(config.app.port, () => {
    console.log(`Server has been started at ${config.app.protocol}://${config.app.hostname}:${config.app.port}`)
})