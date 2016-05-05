'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const User     = keystone.list('User')
const randtoken = require('rand-token')

exports.create = (req, res) => {
  User.model.findOne({tempToken: req.body.tempToken}, (err, user) => {
    if ( err )   { return res.json(Boom.badRequest(err)) }
    if ( !user ) { return res.json(Boom.badRequest(err)) }
    console.log(req.body.verificationCode);
    console.log(user.verificationCode);
    if ( req.body.verificationCode !== String(user.verificationCode) ) {
      return res.json(Boom.forbidden("Validation Code does not match"))
    }

    const token = randtoken.generate(16)
    user.tempToken = null
    user.token = token
    user.tokenedAt = Date.now()

    user.save((err, user) => {
      if (err) { return res.json(Boom.badRequest(err)) }

      const userObj = {
        authToken: user.generateAuthToken(),
        id: user._id,
        name: user.name
      }
      res.status(201).json({user: userObj})
    })
  })
}
