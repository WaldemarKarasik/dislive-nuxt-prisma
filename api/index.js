const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
app.use(express.json())
app.use(cookieParser())

app.use('/auth', require('./routes/auth'))

module.exports = {
  path: '/api',
  handler: app,
}
