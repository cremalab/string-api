'use strict'

const JWT = require('jsonwebtoken')
const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const UserSchema = new Schema({
    createdAt: { type: Date, required: true, default: Date.now },
    phone: { type: Number, required: true, unique: true },
    token: { type: String },
    tempToken: { type: String },
    tokenedAt: { type: Date },
    verificationCode: { type: Number },
    name: {type: String },
    verificationSentAt: { type: Date }
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
