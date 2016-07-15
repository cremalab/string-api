const api              = require('../routes/api')
const i18n             = require('../config/i18n')
const LocationSearcher = require('./locationSearcher')
const ch               = require('./chatHelpers')
const StringBuilder    = require('keystone').list('StringBuilder')

const handle = (type, payload, interface) => {
  if ( Object.keys(actions).indexOf(type) < 0) {
    console.log('no handlers found');
    return Promise.reject(`String doesn't know how to handle this action from API.AI`)
  }
  return actions[type](payload, interface)
}

const actions = {
  'string.start': (payload) => {
    const res = ch.respondWith({text: payload.result.fulfillment.speech})
    return Promise.resolve(res)
  },
  'string.type': (payload) => {
    const builder = new StringBuilder.model({
      user: payload.currentUser, current_activity_category: 'eat'
    })
    return builder.save().then((builder) => {
      return ch.respondWith({
        text: payload.result.fulfillment.speech,
        sentiment: 'friendly'
      })
    })
  },
  'string.party_type': (payload, interface) => {
    console.log('PARTY TYPE');
    return updateBuilder(payload, {
      current_activity_category: 'eat'
    }).then((builder) => {
      response = payload.result.fulfillment.speech
      return ch.respondWith({
        text: i18n.t('strings.ask_party_type'),
        sentiment: 'friendly'
      })
    })
  },
  'string.get_location_suggestions': (payload) => {
    if (payload.result.contexts.length == 0) { return Promise.reject('Start over!') }
    const criteria = payload.result.contexts
      .filter(c => c.name == 'type-question')
      .map((c) => {
        return {
          activity_type: c.parameters.activity_type,
          party_type: c.parameters.party_type,
          rejected: c.parameters.rejected
        }
      })
    return LocationSearcher.findOne(criteria[0]).then((location) => {
      let translation = 'strings.suggest_location'
      if (criteria.rejected == 'true') {translation = 'strings.suggest_location_again'}
      return updateBuilder(payload, {
        last_location: location._id,
        party_type: criteria[0].party_type
      }).then((builder) => {
        let res = ch.respondWith({
          text: i18n.t('strings.suggest_location', {
            name: location.name, rating: location.rating
          }),
          media: [
            {
              type: 'location',
              data: location
            }
          ]
        })

        if (location.photos) {
          const ref = location.photos[0].photo_reference
          gPhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${process.env.GOOGLE_API_KEY}`
          res.media.push({
            type: 'image',
            data: gPhotoUrl
          })
        }

        return res
      })
    })
  },
  'string.find_location': (payload, interface) => {
    response = payload.result.fulfillment.speech
    interface.send(response)
    const response = ch.respondWith({text: i18n.t('strings.ask_party_type')})
    return Promise.resolve(response)
  },
  'string.accept_location_suggestion': (payload, interface) => {
    console.log('accept!');
    return Promise.resolve(ch.respondWith({text: 'okay'}))
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

const updateBuilder = (payload, attrs) => {
  console.log('update builder ===========================');
  console.log(attrs)
  return StringBuilder.model.findOneAndUpdate(
    {user: payload.currentUser},
    attrs,
    { sort: { 'created_at' : -1 } }
  )

}

module.exports = {
  handle: handle
}
