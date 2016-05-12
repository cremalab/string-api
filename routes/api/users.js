'use strict'

const keystone  = require('keystone')
const Boom      = require('boom')
const Messenger = require('../../lib/messenger')
const User = keystone.list('User')
const randtoken = require('rand-token')
const codeGenerator = randtoken.generator({chars: '0-9'});

exports.create = (request, response) => {
  User.model.findOne({phone: request.body.phone}, (err, user) => {
    if ( err ) { return res.status(422).json(Boom.badRequest(err)) }
    if ( !user ) {
      user = new User.model({phone: request.body.phone})
    }
    let tempToken = randtoken.generate(16)
    user.tempToken = tempToken
    user.verificationCode = codeGenerator.generate(5)
    user.tokenedAt  = Date.now()

    const content = `Your String verification code: ${user.verificationCode}`
    user.verificationSentAt = Date.now()
    // Messenger.sendTextMessage(user.phone, content).then((res) => {
    // })

    console.log(`=========VERIFICATION CODE: ${user.verificationCode}`);

    user.save((err, user) => {
      if (err) { return response.status(400).json(Boom.badRequest(err)) }
      response.status(201).json({
        user: {
          _id: user._id,
          tempToken: user.tempToken
        }
      })
    })
  })
}

exports.update = (request, response) => {
  request.currentUser.name = request.body.name
  request.currentUser.save((err, user) => {
    if (err) { return reply(Boom.badRequest(err)) }
    response.status(200).json({user: user})
  })
}

exports.current = (request, response) => {
  const user = request.currentUser
  const userObj = {
    authToken: user.generateAuthToken(),
    id: user._id,
    name: user.name,
    phone: user.phone,
    name: user.name,
    email: user.email
  }

  response.status(200).json({user: userObj})
}
