const apiai            = require('apiai')
const bot              = apiai(process.env.API_AI_TOKEN)
const actions          = require('./chatActions')
const Joi              = require('joi')
const botMessageSchema = require('../config/schemas/botMessageSchema')
let connectedSocket

const register = (app) => {
  const io = app.get('io')
  io.on('connection', function(socket){
    console.log('a user connected');
    connectedSocket = socket
    socket.on('userMessage', (message) => {
      console.log('MESSAGE:')
      console.log(message)
      if (message.action) { return handleBotResponse(message) }
      const request = bot.textRequest(message.text)
      request.on('response', handleBotResponse)
      request.end()
    })
  })
}

const chatInterface = {
  send: (payload) => {
    if (!payload || !payload.text) return
    connectedSocket.emit('botMessage', ch.respondWith(payload))
  }
}

const handleBotResponse = (response) => {
  console.log('response!');
  console.log(response);
  if ( response.status.code != 200) {
    return connectedSocket.emit('botMessage', 'Something went terribly wrong...')
  }
  return actions.handle(response.result.action, response, chatInterface).then((res) => {
    const eType = res['eventType'] || 'botMessage'
    Joi.assert(res, botMessageSchema)
    console.log(res)
    return connectedSocket.emit(eType, res)
  }).catch((res) => connectedSocket.emit(
    'botMessage', ch.respondWith({
      text: res, position: 'center', sentiment: 'sad'
    })
  ))
}

module.exports.register = register
