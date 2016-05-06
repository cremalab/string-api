'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const JWT      = require('jsonwebtoken')
const User     = keystone.list('User')

exports.checkAPIKey = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json(Boom.unauthorized(null, 'Token'));
  }

  if (token.split('.').length !== 3) {
    return res.status(422).json({'error': 'Token is malformed'})
  }

  let decoded;
  try {decoded = JWT.decode(token);}
  catch(e) { // request should still FAIL if the token does not decode.
    return res.status(401).json(Boom.unauthorized('Invalid token format', 'Token'));
  }

  JWT.verify(token, process.env['SIGNING_SECRET'], {}, (err, decoded) => {
    if (err) {
      return res.status(401).json(Boom.unauthorized('Invalid token', 'Token'), null, { credentials: null });
    } else {
      checkUserToken(decoded).then( (user) => {
        req.currentUser = user
        res.locals.currentUser = user
        next()
      }, (err) => {
        return res.status(401).json(Boom.unauthorized(err))
      })
    }
  })
}

function checkUserToken(decoded) {
  return new Promise((resolve, reject) => {
    if( !decoded.token || !decoded.userId ) {
      reject("No token provided")
    }
    User.model.findOne({_id: decoded.userId}, (err, user) => {
      if ( !user || err ) { reject(err) }
      if ( user.token === decoded.token ) {
        resolve(user)
      } else {
        reject("Token does not match", user)
      }
    })
  })
}
