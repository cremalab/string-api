module.exports = {
  register: (app) => {
    const io = app.get('io')
    io.on('connection', function(socket){
      console.log('a user connected');
      socket.on('userMessage', (message) => {
        console.log('MESSAGE:')
        console.log(message)
      })
    })
  }
}
