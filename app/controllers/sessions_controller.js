'use strict'

const Joi       = require('joi'),
      Boom      = require('boom'),
      User      = require('../models/user').User,
      randtoken = require('rand-token')

exports.create = {
  auth: false,
  validate: {
    payload: {
      tempToken: Joi.string().required(),
      verificationCode: Joi.number().required()
    }
  },
  handler: (request, reply) => {
    User.findOne({tempToken: request.payload.tempToken}, (err, user) => {
      if ( err ) { return reply(Boom.badRequest(err)) }
      if ( !user ) { return reply(Boom.badRequest(err))}

      if ( request.payload.verificationCode !== user.verificationCode ) {
        return reply(Boom.forbidden("Validation Code does not match"))
      }

      const token = randtoken.generate(16)
      user.tempToken = null
      user.token = token
      user.tokenedAt = Date.now()


      user.save((err, user) => {
        if (err) { return reply(Boom.badRequest(err)) }

        const userObj = {
          authToken: user.generateAuthToken(),
          id: user._id,
          name: user.name
        }

        reply({user: userObj}).created('/sessions')
      })
    })
  }
}
