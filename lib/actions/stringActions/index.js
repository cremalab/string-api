const i18n               = require('../../../config/i18n')
const LocationSearcher   = require('../../locationSearcher')
const ch                 = require('../../chatHelpers')
const StringBuilder      = require('keystone').list('StringBuilder')
const ActivityCompletion = require('keystone').list('ActivityCompletion')
const Activity           = require('keystone').list('Activity')
const ActivityList       = require('keystone').list('ActivityList')
const Location           = require('keystone').list('Location')
const R                  = require('ramda')
const ActivitySuggester  = require('../../activitySuggester')


const actions = {
  'string:start': (payload) => {
    const res = ch.respondWith({
      text: i18n.t('strings.start'),
      responseOptions: {
        items: [
          {text: 'Eat', params: {activity_type: 'eat'}},
          {text: 'Drink', params: {activity_type: 'drink'}},
          {text: 'See', params: {activity_type: 'see'}},
          {text: 'Do', params: {activity_type: 'do'}}
        ],
        multi: false
      },
      responseAction: 'string:set_activity_type',
      responseType: 'choice'
    })
    return Promise.resolve(res)
  },
  'string:set_activity_type': (payload, interface) => {
    const { activity_type } = payload.params
    const builder = new StringBuilder.model({
      user: payload.userId, activity_category: activity_type
    })
    interface.send({
      text: i18n.t(`strings.type:${activity_type}.start_confirmation`)
    })
    return builder.save().then((builder) => {
      return ch.respondWith({
        text: i18n.t(`strings.ask_party_type`),
        sentiment: 'friendly',
        responseOptions: {
          items: [
            {text: 'Date', params: {party_type: 'date'}},
            {text: 'Friends', params: {party_type: 'friends'}},
            {text: 'Family', params: {party_type: 'family'}},
            {text: 'Solo', params: {party_type: 'solo'}}
          ],
          multi: false
        },
        responseAction: 'string:set_party_type',
        responseType: 'choice'
      })
    })
  },
  'string:set_party_type': (payload, interface) => {

    const { party_type } = payload.params
    return updateBuilder(payload, {
      party_type: party_type
    }).then((builder) => {
      interface.send({
        text: i18n.t(`strings.type:${builder.activity_category}.party_type:${party_type}.finding_suggestions`),
        sentiment: 'friendly'
      })
      return builder
    }).then((builder) => {
      return findAndSuggestLocation(payload, {
        activity_type: builder.activity_category,
        party_type: builder.party_type,
        rejected: builder.rejected_locations
      })
    })
  },
  'string:get_location_suggestions': (payload) => {
    return updateBuilder(payload, payload.params).then((builder) => {
      return findAndSuggestLocation(payload, {
        activity_type: builder.activity_category,
        party_type: builder.party_type,
        rejected: builder.rejected_locations
      })
    })
  },
  'string:find_location': (payload, interface) => {
    response = payload.result.fulfillment.speech
    interface.send(response)
    const response = ch.respondWith({text: i18n.t('strings.ask_party_type')})
    return Promise.resolve(response)
  },
  'string:respond_to_location_suggestion': (payload, interface) => {
    if (payload.params.accepted) {
      return acceptSuggestion(payload, interface)
    } else {
      return rejectSuggestion(payload, interface)
    }
  },
  'string:reject_location_suggestion': (payload, interface) => {
    return rejectSuggestion(payload, interface)
  },
  'string:accept_location_suggestion': (payload, interface) => {
    return acceptSuggestion(payload, interface)
  },
  'string:respond_to_activity_suggestion': (payload, interface) => {
    if (!payload.params.activity) {
      throw new Error('activity is required for this action: it should come \
      from the responseParams of the previous message')
    }
    if ( payload.params.accepted == 'custom') {
      return promptActivityInput(payload)
    }
    if ( payload.params.accepted ) {
      return acceptActivitySuggestion(payload)
    } else {
      return getBuilder(payload.userId).then((builder) => {
        return suggestActivity(builder, payload)
      })
    }
  },
  'string:add_activity': (payload, interface) => {
    getBuilder(payload.userId).then((builder) => {
      if (!builder.activity_list) {
        return new ActivityList.model({
          creator: payload.userId,
          isKept: true
        }).save().then((al) => al._id)
      }
      return builder.activity_list
    }).then((activity_list) => {
      return new Activity.model({
        location: payload.params.location,
        category: payload.params.category,
        description: payload.text,
        creator: payload.userId,
        activity_list: activity_list
      }).save()
    }).then((activity) => {
      return ch.respondWith({
        text: i18n.t(`activities.created`)
      })
    })
  },
}

const updateBuilder = (payload, attrs) => {
  const isAvail = (val,key) => !R.isNil(val)
  return StringBuilder.model.findOneAndUpdate(
    {user: payload.userId},
    {$set: R.pickBy(isAvail, R.pick([
      'activity_type', 'party_type', 'last_location'
    ], attrs))},
    { sort: { 'createdAt' : -1 }, returnNewDocument: true }
  ).then((builder) => {
    const rejected = [].concat(attrs.rejected)
    return builder.rejectLocations(rejected)
  })
}

const getBuilder = (userId) => {
  return StringBuilder.model.find(
    {user: userId}).sort('-createdAt').exec().then((r) => {
      console.log(r);
      return r[0]
    })
}

const acceptActivitySuggestion = (payload, interface) => {
  const completion = new ActivityCompletion.model({
    activity: payload.params.activity,
    user: payload.userId
  })
  return completion.save().then((completion) => {
    return ch.respondWith({
      text: i18n.t(`string.type:${payload.params.activity_type}.successful_activity_suggestion`)
    })
  })
}

const rejectActivitySuggestion = (payload, interface) => {
  return getBuilder((builder) => {
    return suggestActivity(builder, payload)
  })
}

const rejectSuggestion = (payload, interface) => {
  const rejected = [].concat(payload.params.location)
  return getBuilder(payload.userId).then((builder) => {
    interface.send({
      text: i18n.t(`strings.type:${builder.activity_category}.party_type:${builder.party_type}.rejected_suggestion_acknowledgement`)
    })
    return builder.rejectLocations(rejected).then(() => builder)
  }).then((builder) => {
    return findAndSuggestLocation(payload, {
      activity_type: builder.activity_category,
      party_type: builder.party_type,
      rejected: builder.rejected_locations
    })
  })
}

const acceptSuggestion = (payload, interface) => {
  return getBuilder(payload.userId).then((builder) => {
    interface.send({
      text: `strings.type:${builder.activity_category}.successful_suggestion`
    })
    return suggestActivity(builder, payload)
  })
}

const suggestActivity = (builder, payload) => {
  return ActivitySuggester.suggest({
    activity_type: builder.activity_category,
    location: builder.last_location
  }).then((activity) => {
    return updateBuilder(payload, {last_activity: activity._id}).then(() => activity)
  }).then((activity) => {
    return ch.respondWith({
      text: i18n.t(`strings.type:${builder.activity_category}.suggest_activity`),
      media: [
        {
          type: 'quote',
          data: activity.description
        }
      ],
      responseOptions: {
        items: [
          {text: 'Okay!', params: {accepted: true}},
          {text: 'Meh', params: {accepted: false}},
          {text: 'My own', params: {accepted: 'custom'}}
        ],
        multi: false
      },
      responseAction: 'string:respond_to_activity_suggestion',
      responseParams: {
        activity: activity._id,
        activity_type: builder.activity_category
      },
      responseType: 'choice'
    })
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
        ],
        responseOptions: {
          items: [
            {text: 'Sounds good', params: {accepted: true}},
            {text: 'No thanks', params: {accepted: false}}
          ],
          multi: false
        },
        responseAction: 'string:respond_to_location_suggestion',
        responseParams: {
          location: location._id
        },
        responseType: 'choice',
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

const promptActivityInput = (payload) => {
  return getBuilder(payload.userId).then((builder) => {
    return Location.model.findOne({_id: builder.last_location}).exec().then((location) => {
      return ch.respondWith({
        text: i18n.t(`strings.type:${builder.activity_category}.prompt_activity`, {
          location: location.name
        }),
        responseAction: 'string:create_activity',
        responseParams: {
          location: location._id,
          category: builder.activity_category
        },
        responseType: 'text'
      })
    })
  })
}

module.exports = actions
