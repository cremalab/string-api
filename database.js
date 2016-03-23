const Mongoose = require('mongoose'),
      config = require('./config')

Mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db)
const db = Mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function callback() {
  console.log("Connection with database succeeded.")
})

exports.Mongoose = Mongoose
exports.db = db
