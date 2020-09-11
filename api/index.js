const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
app.use(express.json())
app.use(cookieParser())

app.use('/auth', require('./routes/auth'))
app.use('/channels', require('./routes/channels'))
app.use('/upload', require('./routes/upload'))
app.use('/post', require('./routes/post'))
app.use('/video', require('./routes/video'))
app.use('/author', require('./routes/author'))
module.exports = {
  path: '/api',
  handler: app,
}
