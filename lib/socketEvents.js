const apiai            = require('apiai')
const bot              = apiai(process.env.API_AI_TOKEN)
const actions          = require('./chatActions')
const Joi              = require('joi')
const botMessageSchema = require('../config/schemas/botMessageSchema')
const ch               = require('./chatHelpers')
const authUserMessage  = require('./authUserMessage')
let connectedSocket

const register = (app) => {
  const io = app.get('io')

  io.on('connection', function(socket){
    console.log('a user connected');
    connectedSocket = socket
    socket.on('userMessage', (message) => {
      console.log('MESSAGE: KSDJFLKJF')
      console.log(message)
      if (message.action) { return handleUserResponse(message) }
      const request = bot.textRequest(message.text)
      request.on('response', (res) => {
        return handleBotResponse(Object.assign(res, {currentUser: message.currentUser}))
      })
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

// Responses from client app
const handleUserResponse = (response) => {
  console.log('userResponse')
  return authUserMessage(response).then((response) => {
    return actions.handle(response.action, response, chatInterface).then((res) => {
      const eType = res['eventType'] || 'botMessage'
      console.log(res)
      Joi.assert(res, botMessageSchema)
      return connectedSocket.emit(eType, res)
    })
  }).catch((res) => {
    console.log("userResponse Catch", res);
    connectedSocket.emit(
      'botMessage', ch.respondWith({
        text: res, position: 'center', sentiment: 'sad',
        responseAction: 'user:authenticate'
      })
    )
  })
}

// Responses from API.ai
const handleBotResponse = (response) => {
  console.log('response!');
  console.log(response)
  if ( response.status.code != 200) {
    console.log('bad bot response');
    return connectedSocket.emit('botMessage',
      ch.respondWith({
        text: 'Something went terribly wrong', position: 'center', sentiment: 'sad'
      })
    )
  }
  return actions.handle(response.result.action, response, chatInterface).then((res) => {
    const eType = res['eventType'] || 'botMessage'
    console.log(res)
    Joi.assert(res, botMessageSchema)
    return connectedSocket.emit(eType, res)
  }).catch((res) => {
    console.log('catch at socketEvents');
    console.log(res);
    connectedSocket.emit(
      'botMessage', ch.respondWith({
        text: res, position: 'center', sentiment: 'sad'
      })
    )
  })
}

module.exports.register = register
