const express = require("express")
const bodyParser = require("body-parser")
const router = require('./src/routes/router')
const { config } = require('dotenv')
const cookieParser = require('cookie-parser')

const app = express()
const port = 8000

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

config()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.set('views', 'src/views')
app.use(express.static("public"));

io.on('connection', socket => {
  console.log('socket terkoneksi!!');
  socket.on('send_message', pesan => {
    socket.broadcast.emit('new_message', pesan)
  })
})

app.use(router)

server.listen(port, () => {
  console.log(`server is ready on port ${port}`)
})