'use strict'

const keystone  = require('keystone')
const Boom      = require('boom')
const Messenger = require('../../lib/messenger')
const User = keystone.list('User')


exports.create = (request, response) => {
  User.model.findOne({phone: request.body.phone}, (err, user) => {
    if ( err ) { return reply(Boom.badRequest(err)) }
    if ( !user ) {
      user = new User.model({phone: request.body.phone})
    }
    let tempToken = randtoken.generate(16)
    user.tempToken = tempToken
    user.verificationCode = codeGenerator.generate(5)
    user.tokenedAt  = Date.now()

    const content = `Your String verification code: ${user.verificationCode}`
    Messenger.sendTextMessage(user.phone, content).then((res) => {
      user.verificationSentAt = Date.now()
      user.save()
    })

    console.log(`=========VERIFICATION CODE: ${user.verificationCode}`);

    user.save((err, user) => {
      if (err) { return reply(Boom.badRequest(err)) }
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
  // request.currentUser().name = request.body.name
  // request.currentUser().save((err, user) => {
  //   if (err) { return reply(Boom.badRequest(err)) }
  //   response.json({user: user}).code(200)
  // })
}
