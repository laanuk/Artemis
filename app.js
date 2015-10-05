var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var config = require('./config')

mongoUri = 'mongodb://' + config.MONGO_USERNAME + ':' +
    config.MONGO_PASSWORD + '@' + config.MONGO_HOST + '/' +
    config.MONGO_DATABASE

mongoose.connection.on('error', function (err) {
  console.error('MongoDB error: %s', err)
})
mongoose.connect(mongoUri)

mongoose.connection.on('error', function (err) {
  console.error('MongoDB error: %s', err)
})

var connection = mongoose.connections[0]
var router = express.Router()

var app = express()
var http = require('http')
server = http.createServer(app)

var logger = require('winston')

app.use(bodyParser.urlencoded({ extended: true }))
app.get('/app', function (req, res, next) {
  var filePath = __dirname + '/public/setup.html'
  res.sendFile(filePath)
})

function onStart () {
  logger.info('Server is starting.')
}

server.listen(config.WEB_PORT, onStart)

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  var filePath = __dirname + '/public/setup.html'
  res.sendFile(filePath)
})

app.get('/game', function (req, res) {
  console.log(req)
  var filePath = __dirname + '/public/app.html'
  res.sendFile(filePath)
})