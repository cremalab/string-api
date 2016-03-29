const client = require('twilio')(process.env['TWILIO_SID'], process.env['TWILIO_TOKEN'])

exports.sendTextMessage = function(phone, content) {
  return new Promise(resolve, reject) {
    client.sendMessage({
      to:`+1${phone}`,
      body: content
    }, function(err, responseData) {
      if (err) { return reject(err) }
        resolve(responseData)
      }
    })
  }
}
