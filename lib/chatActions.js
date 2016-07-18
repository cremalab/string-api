const api              = require('../routes/api')
const i18n             = require('../config/i18n')
const LocationSearcher = require('./locationSearcher')
const ch               = require('./chatHelpers')
const StringBuilder    = require('keystone').list('StringBuilder')
const R                = require('ramda')

const handle = (type, payload, interface) => {
  if ( Object.keys(actions).indexOf(type) < 0) {
    console.log('no handlers found');
    return Promise.reject(`String doesn't know how to handle this action from API.AI`)
  }
  return actions[type](payload, interface)
}

const actions = {
  'string.start': (payload) => {
    const res = ch.respondWith({
      text: i18n.t('strings.start'),
      responseOptions: {
        items: [
          {text: 'Eat', paramName: 'activity_type', paramValue: 'eat'},
          {text: 'Drink', paramName: 'activity_type', paramValue: 'drink'},
          {text: 'See', paramName: 'activity_type', paramValue: 'see'},
          {text: 'Do', paramName: 'activity_type', paramValue: 'do'}
        ]
      },
      responseAction: 'string.set_activity_type'
    })
    return Promise.resolve(res)
  },
  'string.set_activity_type': (payload, interface) => {
    const { activity_type } = payload.params
    const builder = new StringBuilder.model({
      user: payload.currentUser, activity_category: activity_type
    })
    interface.send(ch.respondWith({
      text: i18n.t(`strings.type:${activity_type}.start_confirmation`)
    }))
    return builder.save().then((builder) => {
      return ch.respondWith({
        text: i18n.t(`strings.ask_party_type`),
        sentiment: 'friendly',
        responseOptions: {
          items: [
            {text: 'Date', paramName: 'party_type', paramValue: 'date'},
            {text: 'Friends', paramName: 'party_type', paramValue: 'friends'},
            {text: 'Family', paramName: 'party_type', paramValue: 'family'},
            {text: 'Solo', paramName: 'party_type', paramValue: 'solo'}
          ]
        },
        responseAction: 'strings.set_party_type'
      })
    })
  },
  'string.set_party_type': (payload, interface) => {

    const { party_type } = payload.params
    return updateBuilder(payload, {
      party_type: party_type
    }).then((builder) => {
      interface.send(ch.respondWith({
        text: i18n.t(`strings.type:${builder.activity_type}.party_type:${party_type}.finding_suggestions`),
        sentiment: 'friendly'
      }))
      return builder
    }).then((builder) => {
      return findAndSuggestLocation(payload, {
        activity_type: builder.activity_category,
        party_type: builder.party_type,
        rejected: builder.rejected_locations
      })
    })
  },
  'string.get_location_suggestions': (payload) => {
    return updateBuilder(payload, payload.params).then((builder) => {
      return findAndSuggestLocation(payload, {
        activity_type: builder.activity_category,
        party_type: builder.party_type,
        rejected: builder.rejected_locations
      })
    })
  },
  'string.find_location': (payload, interface) => {
    response = payload.result.fulfillment.speech
    interface.send(response)
    const response = ch.respondWith({text: i18n.t('strings.ask_party_type')})
    return Promise.resolve(response)
  },
  'string.reject_location_suggestion': (payload, interface) => {
    console.log('reject!');
    const attrs = Object.assign(payload.params, {rejected: payload.params.location_id})
    return updateBuilder(payload, attrs).then((builder) => {
      console.log('BUILDER UPDATED, NOW...');
      interface.send(ch.respondWith({
        text: i18n.t(`strings.type:${builder.activity_category}.party_type:${builder.party_type}.rejected_suggestion_acknowledgement`)
      }))
      return builder
    }).then((builder) => {
      console.log(builder);
      return findAndSuggestLocation(payload, {
        activity_type: builder.activity_category,
        party_type: builder.party_type,
        rejected: builder.rejected_locations
      })
    })
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
  const isAvail = (val,key) => !R.isNil(val)
  return StringBuilder.model.findOneAndUpdate(
    {user: payload.currentUser},
    R.pickBy(isAvail, R.pick(['activity_type', 'party_type'], attrs)),
    { sort: { 'created_at' : -1 } }
  ).then((builder) => {
    const rejected = [].concat(attrs.rejected)
    return builder.rejectLocations(rejected)
  })
}

const findAndSuggestLocation = (payload, criteria) => {
  return LocationSearcher.findOne(criteria).then((location) => {
    let translation = 'strings.suggest_location'
    return updateBuilder(payload, {
      last_location: location._id,
      party_type: criteria.party_type
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
}

module.exports = {
  handle: handle
}
