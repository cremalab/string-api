const actions          = require('./chatActions')
const Joi              = require('joi')
const botMessageSchema = require('../config/schemas/botMessageSchema')
const ch               = require('./chatHelpers')
const authUserMessage  = require('./authUserMessage')
let connectedSocket

const register = (app) => {
  const io = app.get('io')

  io.on('connection', function(socket){
    console.log('a user connected')
    connectedSocket = socket
    socket.on('userMessage', (message) => {
      console.log(`=== USER MESSAGE ===\n${JSON.stringify(message, null, 2)}\n====================\n`)
      if (message.action) { return handleUserResponse(message) }
      return connectedSocket.emit(
        'botMessage', ch.respondWith({
          text: `I don't know what to do.`, position: 'center', sentiment: 'sad'
        })
      )
    })
  })
}

const chatInterface = {
  send: (payload) => {
    if (!payload || !payload.text) return
    connectedSocket.emit('botMessage', ch.respondWith(payload))
  }
}

// Responses from client app
const handleUserResponse = (userResponse) => {
  return authUserMessage(userResponse).then((response) => {
    return actions.handle(response.action, response, chatInterface).then((res) => {
      const eType = res['eventType'] || 'botMessage'
      console.log(`=== BOT MESSAGE ===\n${JSON.stringify(res, null, 2)}\n====================\n`)
      Joi.assert(res, botMessageSchema)
      return connectedSocket.emit(eType, res)
    })
  }).catch((res) => {
    console.log('userResponse Catch', res)
    connectedSocket.emit(
      'botMessage', ch.respondWith({
        text: res, position: 'center', sentiment: 'sad',
        responseAction: 'user:authenticate'
      })
    )
  })
}

module.exports.register = register
