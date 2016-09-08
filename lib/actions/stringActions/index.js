const i18n                = require('../../../config/i18n')
const LocationSearcher    = require('../../locationSearcher')
const ch                  = require('../../chatHelpers')
const StringBuilder       = require('keystone').list('StringBuilder')
const ActivityCompletion  = require('keystone').list('ActivityCompletion')
const Activity            = require('keystone').list('Activity')
const ActivityList        = require('keystone').list('ActivityList')
const Location            = require('keystone').list('Location')
const R                   = require('ramda')
const ActivitySuggester   = require('../../activitySuggester')
const helpers             = require('../../chatHelpers')

const activityPromptOptions = {
  items: [
    {text: 'Eat', params: {activity_type: 'eat'}},
    {text: 'Drink', params: {activity_type: 'drink'}},
    {text: 'See', params: {activity_type: 'see'}},
    {text: 'Do', params: {activity_type: 'do'}}
  ],
  multi: false
}

const actions = {
  'string:start': () => {
    const res = ch.respondWith({
      text: i18n.t('strings.start'),
      responseOptions: activityPromptOptions,
      responseAction: 'string:set_activity_type',
      responseType: 'choice'
    })
    return Promise.resolve(res)
  },
  'string:set_activity_type': (payload, chatInterface) => {
    return helpers.checkSchema(payload, 'string:set_activity_type').then(() => {
      const { activity_type, continued } = payload.params

      const builder = new StringBuilder.model({
        user: payload.currentUser._id, activity_type: activity_type
      })
      chatInterface.send({
        text: i18n.t(`strings.type:${activity_type}.start_confirmation`)
      })
      let builderAction
      if (continued) {
        console.log(`CONTINUED: ${activity_type}`)
        builderAction = updateBuilder.bind(null, payload, {activity_type: activity_type})
      } else {
        builderAction = builder.save
      }
      return builderAction().then((builder) => {
        if (builder.party_type) {
          return findAndSuggestLocation(payload, {
            activity_type: builder.activity_type,
            party_type: builder.party_type,
            rejected: builder.rejected_locations
          })
        }

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

    })
  },
  'string:set_party_type': (payload, chatInterface) => {
    return helpers.checkSchema(payload, 'string:set_party_type').then(() => {
      return updateBuilder(payload, {
        party_type: payload.params.party_type
      })
    }).then((builder) => {
      console.log('BUILDER TYPE', builder.activity_type)
      chatInterface.send({
        text: i18n.t(`strings.type:${builder.activity_type}.party_type:${payload.params.party_type}.finding_suggestions`),
        sentiment: 'friendly'
      })
      return builder
    }).then((builder) => {
      return findAndSuggestLocation(payload, {
        activity_type: builder.activity_type,
        party_type: builder.party_type,
        rejected: builder.rejected_locations
      })
    })
  },
  'string:get_location_suggestions': (payload) => {
    return updateBuilder(payload, payload.params).then((builder) => {
      return findAndSuggestLocation(payload, {
        activity_type: builder.activity_type,
        party_type: builder.party_type,
        rejected: builder.rejected_locations
      })
    })
  },
  'string:find_location': (payload, chatInterface) => {
    const response = payload.result.fulfillment.speech
    chatInterface.send(response)
    const chatResponse = ch.respondWith({text: i18n.t('strings.ask_party_type')})
    return Promise.resolve(chatResponse)
  },
  'string:respond_to_location_suggestion': (payload, chatInterface) => {
    if (payload.params.accepted) {
      return acceptSuggestion(payload, chatInterface)
    } else {
      return rejectSuggestion(payload, chatInterface)
    }
  },
  'string:reject_location_suggestion': (payload, chatInterface) => {
    return rejectSuggestion(payload, chatInterface)
  },
  'string:accept_location_suggestion': (payload, chatInterface) => {
    return acceptSuggestion(payload, chatInterface)
  },
  'string:respond_to_activity_suggestion': (payload, chatInterface) => {
    if (!payload.params.activity) {
      throw new Error('activity is required for this action: it should come \
      from the responseParams of the previous message')
    }
    if ( payload.params.accepted == 'custom') {
      return promptActivityInput(payload)
    }
    if ( payload.params.accepted ) {
      payload.params.continued = true
      return acceptActivitySuggestion(payload, chatInterface)
    } else {
      return getBuilder(payload.currentUser._id).then((builder) => {
        return suggestActivity(builder, payload)
      })
    }
  },
  'string:create_activity': (payload) => {
    helpers.checkSchema(payload, 'string:create_activity')
    let party_type
    return getBuilder(payload.currentUser._id).then((builder) => {
      if (!builder) { return Promise.reject(`No Builder is present for this user`) }
      if (!builder.activity_list) {
        return new ActivityList.model({
          creator: payload.currentUser._id,
          isKept: true
        }).save().then((al) => al._id)
      }
      return builder
    }).then((builder) => {
      party_type = builder.party_type
      return new Activity.model({
        location: payload.params.location,
        category: payload.params.category,
        description: payload.text,
        creator: payload.currentUser._id,
        activity_list: builder.activity_list
      }).save()
    }).then((activity) => {
      return new ActivityCompletion.model({
        activity: activity._id,
        user: payload.currentUser._id,
        location: payload.params.location,
        party_type: party_type
      }).save()
    }).then((completion) => {
      return ch.respondWith({
        text: i18n.t(`activities.prompt_image`),
        responseOptions: {
          items: [
            {text: '📷', params: { takePhoto: true }},
            {text: 'No thanks', params: { takePhoto: false }}
          ],
          multi: false
        },
        responseAction: 'activity:handle_image_choice',
        responseParams: {
          activity_completion: completion,
          activity: completion.activity
        },
        responseType: 'choice'
      })
    })
  },
  'string:continue': () => {
    return ch.respondWith({
      text: i18n.t('strings.continue'),
      responseOptions: activityPromptOptions,
      responseAction: 'string:set_activity_type',
      responseParams: {
        continued: true
      },
      responseType: 'choice'
    })
  }
}

const updateBuilder = (payload, attrs) => {
  console.log('UPDATE BUILDER')
  console.log(payload)
  console.log(attrs)
  const isAvail = (val) => !R.isNil(val)
  return StringBuilder.model.findOneAndUpdate(
    {user: payload.currentUser._id},
    {$set: R.pickBy(isAvail, R.pick([
      'activity_type', 'party_type', 'last_location'
    ], attrs))},
    { sort: { 'createdAt' : -1 }, returnNewDocument: true, new: true }
  ).then((builder) => {
    if (attrs.rejected) {
      const rejected = [].concat(attrs.rejected)
      return builder.rejectLocations(rejected)
    }
    console.log('BUILDER SAVED:')
    console.log(builder)
    return builder
  })
}

const getBuilder = (userId) => {
  return StringBuilder.model.find(
    {user: userId}).sort('-createdAt').exec().then((r) => {
      console.log(r)
      return r[0]
    })
}

const acceptActivitySuggestion = (payload, chatInterface) => {
  return helpers.checkSchema(payload, 'string:respond_to_activity_suggestion').then(() => {
    return getBuilder(payload.currentUser._id)
  }).then((builder) => {
    return Activity.model.findOne({_id: payload.params.activity}).then((activity) => {
      const completion = new ActivityCompletion.model({
        activity: payload.params.activity,
        user: payload.currentUser._id,
        location: activity.location,
        party_type: builder.party_type
      })

      return completion.save()
    })
  }).then((completion) => {
    chatInterface.send({
      text: i18n.t(`strings.type:${payload.params.activity_type}.successful_activity_suggestion`)
    })
    return ch.respondWith({
      text: i18n.t(`activities.prompt_image`),
      responseOptions: {
        items: [
          {text: '📷', params: { takePhoto: true }},
          {text: 'No thanks', params: { takePhoto: false }}
        ],
        multi: false
      },
      responseAction: 'activity:handle_image_choice',
      responseParams: {
        activity_completion: completion._id,
        activity: completion.activity
      },
      responseType: 'choice'
    })
    // if (payload.params.continued) {
    //   // chatInterface.send({text: message})
    //   const res = ch.respondWith({
    //     text: i18n.t('strings.continue'),
    //     responseOptions: activityPromptOptions,
    //     responseAction: 'string:set_activity_type',
    //     responseParams: {
    //       continued: true
    //     },
    //     responseType: 'choice'
    //   })
    //   return Promise.resolve(res)
    // }
    // return ch.respondWith({
    //   text: message
    // })
  })
}

const rejectSuggestion = (payload, chatInterface) => {
  const rejected = [].concat(payload.params.location)
  return getBuilder(payload.currentUser._id).then((builder) => {
    chatInterface.send({
      text: i18n.t(`strings.type:${builder.activity_type}.party_type:${builder.party_type}.rejected_suggestion_acknowledgement`)
    })
    return builder.rejectLocations(rejected).then(() => builder)
  }).then((builder) => {
    return findAndSuggestLocation(payload, {
      activity_type: builder.activity_type,
      party_type: builder.party_type,
      rejected: builder.rejected_locations
    })
  })
}

const acceptSuggestion = (payload, chatInterface) => {
  return getBuilder(payload.currentUser._id).then((builder) => {
    chatInterface.send({
      text: i18n.t(`strings.type:${builder.activity_type}.successful_suggestion`)
    })
    return suggestActivity(builder, payload)
  })
}

const suggestActivity = (builder, payload) => {
  return ActivitySuggester.suggest({
    activity_type: builder.activity_type,
    location: builder.last_location
  }).then((activity) => {
    return updateBuilder(payload, {last_activity: activity._id}).then(() => activity)
  }).then((activity) => {
    return ch.respondWith({
      text: i18n.t(`strings.type:${builder.activity_type}.suggest_activity`),
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
        activity_type: builder.activity_type
      },
      responseType: 'choice'
    })
  })
}

const findAndSuggestLocation = (payload, criteria) => {
  return LocationSearcher.findOne(criteria).then((location) => {
    return updateBuilder(payload, {
      last_location: location._id,
      party_type: criteria.party_type
    }).then(() => {
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
        responseType: 'choice'
      })

      if (location.photos) {
        const ref = location.photos[0].photo_reference
        const gPhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${process.env.GOOGLE_API_KEY}`
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
  return getBuilder(payload.currentUser._id).then((builder) => {
    return Location.model.findOne({_id: builder.last_location}).exec().then((location) => {
      return ch.respondWith({
        text: i18n.t(`strings.type:${builder.activity_type}.prompt_activity`, {
          location: location.name
        }),
        responseAction: 'string:create_activity',
        responseParams: {
          location: location._id,
          category: builder.activity_type
        },
        responseType: 'text'
      })
    })
  })
}

module.exports = actions
