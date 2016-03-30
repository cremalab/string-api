'use strict'

const Joi       = require('joi'),
      Boom      = require('boom'),
      User      = require('../models/user').User,
      randtoken = require('rand-token'),
      Messenger = require('../lib/messenger')

const codeGenerator = randtoken.generator({chars: '0-9'});

exports.findOrCreate = {
  tags: ['api'],
  description: 'Create user OR reset their tempToken',
  auth: false,
  validate: {
    payload: {
      phone: Joi.number().required()
    }
  },
  handler: (request, reply) => {
    User.findOne({phone: request.payload.phone}, (err, user) => {
      if ( err ) { return reply(Boom.badRequest(err)) }
      if ( !user ) {
        user = new User({phone: request.payload.phone})
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
        reply({
          user: {
            _id: user._id,
            tempToken: user.tempToken
          }
        }).created('/users/' + user._id)
      })
    })
  }
}

exports.update = {
  tags: ['api'],
  description: 'Create user OR reset their tempToken',
  validate: {
    payload: {
      name: Joi.string().required()
    }
  },
  handler: (request, reply) => {
    request.currentUser().name = request.payload.name
    request.currentUser().save((err, user) => {
      if (err) { return reply(Boom.badRequest(err)) }
      reply({user: user}).code(200)
    })
  }
}
