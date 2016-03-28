'use strict'

const Joi       = require('joi'),
      Boom      = require('boom'),
      User      = require('../models/user').User,
      randtoken = require('rand-token'),
      JWT       = require('jsonwebtoken')

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

      const authObj = {
        token: token,
        userId: user._id
      }

      user.save((err, user) => {
        if (err) { return reply(Boom.badRequest(err)) }

        const authToken = JWT.sign(authObj, process.env['SIGNING_SECRET'])
        const userObj = {
          authToken: authToken,
          id: user._id,
          name: user.name
        }

        reply({user: userObj}).created('/sessions')
      })
    })
  }
}
