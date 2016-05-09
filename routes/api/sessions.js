'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const User     = keystone.list('User')
const randtoken = require('rand-token')

exports.create = (req, res) => {
  if (!req.body.tempToken) {
    return res.status(400).json(Boom.badRequest("Missing tempToken param"))
  }
  User.model.findOne({tempToken: req.body.tempToken}, (err, user) => {
    if ( err )   { return res.status(400).json(Boom.badRequest(err)) }
    if ( !user ) { return res.status(404).json(Boom.badRequest(err)) }
    if ( req.body.verificationCode !== user.verificationCode ) {
      return res.status(403).json(Boom.forbidden("Validation Code does not match"))
    }

    const token = randtoken.generate(16)
    user.tempToken = null
    user.token = token
    user.tokenedAt = Date.now()

    user.save((err, user) => {
      if (err) { return res.status(400).json(Boom.badRequest(err)) }

      const userObj = {
        authToken: user.generateAuthToken(),
        id: user._id,
        name: user.name
      }
      res.status(201).json({user: userObj})
    })
  })
}
