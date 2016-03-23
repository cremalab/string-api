'use strict'

const Mongoose = require('mongoose'),
      config = require('./config')

let database

switch (process.env['NODE_ENV']) {
  case 'test':
    database = config.test.database
    break;
  case 'production':
    database = config.production.database
    break;
  default:
    database = config.development.database
    break;
}

console.log(database);

Mongoose.connect('mongodb://' + database.host + '/' + database.db)
const db = Mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function callback() {
  console.log("Connection with database succeeded.")
})

exports.Mongoose = Mongoose
exports.db = db
