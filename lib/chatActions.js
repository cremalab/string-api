const api              = require('../routes/api')
const i18n             = require('../config/i18n')
const LocationSearcher = require('./locationSearcher')
const ch               = require('./chatHelpers')
const StringBuilder    = require('keystone').list('StringBuilder')
const actions          = require('./actions')
const R                = require('ramda')

const handle = (type, payload, interface) => {
  if ( Object.keys(actions).indexOf(type) < 0) {
    console.log('no handlers found');
    return Promise.reject(`String doesn't know how to handle this action from API.AI`)
  }
  return actions[type](payload, interface)
}

const proxy = (handler, params = {}, payload = {}) => {
  // Call API methods and convert responses to whatever
  const req = {
    body: payload,
    params: params,
    currentUser: {}
  }
  const res = {
    status: (code) => {return},
    json: (response) => Promise.resolve(response)
  }
  return handler(req, res)
}


module.exports = {
  handle: handle
}
