const JWT      = require('jsonwebtoken')
const User     = require('keystone').list('User')

module.exports = function(response) {
  console.log('authUserMessage', response)
  const token = response.token
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject('Unauthenticated')
    }

    if (token.split('.').length !== 3) {
      return reject('Token is malformed')
    }

    let decoded
    try {decoded = JWT.decode(token)}
    catch(e) { // request should still FAIL if the token does not decode.
      return reject('Invalid token format', 'Token')
    }
    return JWT.verify(token, process.env['SIGNING_SECRET'], {}, (err, decoded) => {
      if (err) {
        return reject('Invalid token')
      } else {
        return checkUserToken(decoded).then( (user) => {
          response.currentUser = user
          return resolve(response)
        }, () => {
          return reject('Unauthorized')
        })
      }
    })
  })
}

function checkUserToken(decoded) {
  return new Promise((resolve, reject) => {
    if( !decoded.token || !decoded.userId ) {
      reject('No token provided')
    }
    User.model.findById(decoded.userId, (err, user) => {
      if ( !user || err ) { return reject(err) }
      if ( user.token === decoded.token ) {
        resolve(user)
      } else {
        reject('Token does not match', user)
      }
    })
  })
}
