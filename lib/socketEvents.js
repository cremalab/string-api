const apiai   = require('apiai')
const bot     = apiai(process.env.API_AI_TOKEN)
const actions = require('./chatActions')
let connectedSocket

const register = (app) => {
  const io = app.get('io')
  io.on('connection', function(socket){
    console.log('a user connected');
    connectedSocket = socket
    socket.on('userMessage', (message) => {
      console.log('MESSAGE:')
      console.log(message)
      const request = bot.textRequest(message)
      request.on('response', handleBotResponse)
      request.end()
    })
  })
}

const handleBotResponse = (response) => {
  console.log('response!');
  console.log(response);
  if ( response.status.code != 200) {
    return connectedSocket.emit('botMessage', 'Something went terribly wrong...')
  }
  actions.handle(response.result.action, response).then((res) => {
    if (typeof res == 'string') { res.eventType = 'botMessage' }
    connectedSocket.emit(res.eventType, res)
  })

}

module.exports.register = register
