module.exports = {
  sleep: (duration) => {
    if (process.env.NODE_ENV == 'test') { return Promise.resolve()}
    return new Promise(function(resolve){
      setTimeout(function(){
        resolve()
      }, duration || 1000)
    })
  }
}
