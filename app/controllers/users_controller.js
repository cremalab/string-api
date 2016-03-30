'use strict'

const Joi       = require('joi'),
      Boom      = require('boom'),
      User      = require('../models/user').User,
      randtoken = require('rand-token')

const codeGenerator = randtoken.generator({chars: '0-9'});

exports.findOrCreate = {
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
