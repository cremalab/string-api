'use strict'

const JWT = require('jsonwebtoken')
const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const UserSchema = new Schema({
    createdAt: { type: Date, required: true, default: Date.now },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          return /\d{10}/.test(v);
        },
        message: '{VALUE} is not a valid phone number!'
      },
      required: [true, 'User phone number required']
    },
    token: { type: String },
    tempToken: { type: String },
    tokenedAt: { type: Date },
    verificationCode: { type: Number },
    name: {type: String }
})

UserSchema.methods.generateAuthToken = function() {
  const authObj = {
    token: this.token,
    userId: this._id
  }
  return JWT.sign(authObj, process.env['SIGNING_SECRET'])
}

let User;
if (Mongoose.models.user) {
  User = Mongoose.model('user');
} else {
  User = Mongoose.model('user', UserSchema);
}
module.exports = {
  User: User
}
