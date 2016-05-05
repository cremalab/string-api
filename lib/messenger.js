const client = require('twilio')(process.env['TWILIO_SID'], process.env['TWILIO_TOKEN'])

exports.sendTextMessage = function(phone, content) {
  return new Promise((resolve, reject) => {
    if (process.env['NODE_ENV'] === 'test' ) { return resolve({})}

    client.sendMessage({
      to:`+1${phone}`,
      from: process.env['TWILIO_FROM_PHONE'],
      body: content
    }, (err, responseData) => {
      console.log(err);
      console.log(responseData);
      if (err) { return reject(err) }
      resolve(responseData)
    })
  })
}
