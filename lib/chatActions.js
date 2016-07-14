const api              = require('../routes/api')
const i18n             = require('../config/i18n')
const LocationSearcher = require('./locationSearcher')

const handle = (type, payload) => {
  if ( Object.keys(actions).indexOf(type) < 0) {
    console.log('no handlers found');
    return Promise.reject(`String doesn't know how to handle this action from API.AI`)
  }
  return actions[type](payload)
}

const actions = {
  'string.type': (payload) => {
    response = respondWith({text: payload.result.fulfillment.speech})
    return Promise.resolve(response)
  },
  'string.party_type': (payload) => {
    response = payload.result.fulfillment.speech
    const response = respondWith({
      text: i18n.t('strings.ask_party_type'),
      sentiment: 'friendly'
    })
    return Promise.resolve(response)
  },
  'string.get_location_suggestions': (payload) => {
    if (payload.result.contexts.length == 0) { return Promise.reject('Start over!') }
    const criteria = payload.result.contexts
      .filter(c => c.name == 'type-question')
      .map((c) => {
        return {
          activity_type: c.parameters.activity_type,
          party_type: c.parameters.party_type
        }
      })
    return LocationSearcher.findOne(criteria).then((location) => {
      const ref = location.photos[0].photo_reference
      gPhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${process.env.GOOGLE_API_KEY}`

      return respondWith({
        text: i18n.t('strings.suggest_location', {
          name: location.name, rating: location.rating
        }),
        media: [
          {
            type: 'image',
            data: gPhotoUrl
          },
          {
            type: 'location',
            data: location
          }
        ]
      })
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

const respondWith = (attrs) => {
  return Object.assign({}, {
    date: new Date(),
    uniqueId: Date.now().toString(),
    position: 'left',
    sentiment: 'friendly',
    name: "String",
  }, attrs)
}

module.exports = {
  handle: handle
}
