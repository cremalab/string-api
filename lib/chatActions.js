const api = require('../routes/api')
const LocationSearcher = require('./locationSearcher')
const handle = (type, payload) => {
  if ( Object.keys(actions).indexOf(type) < 0) return Promise.reject()
  console.log(type)
  console.log(actions[type])
  return actions[type](payload)
}

const actions = {
  'string.type': (payload) => {
    response = payload.result.fulfillment.speech
    return Promise.resolve(response)
  },
  'string.party_type': (payload) => {
    console.log('party_type')
    console.log(payload)
  },
  'string.get_location_suggestions': (payload) => {
    const criteria = payload.result.contexts.filter(c => c.name == 'location-suggestion').map((c) => {
      return { activity_type: c.params, party_type: c.params.party_type }
    })[0]
    LocationSearcher.findOne(criteria).then((location) => {
      return {
        item: location,
        primaryKey: '_id',
        nameKey: 'name',
        imageKey: '',
        eventType: 'botCard'
      }
    })
  }
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
