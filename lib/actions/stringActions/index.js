const i18n               = require('../../../config/i18n')
const LocationSearcher   = require('../../locationSearcher')
const Places             = require('../../places')
const ch                 = require('../../chatHelpers')
const StringBuilder      = require('keystone').list('StringBuilder')
const ActivityCompletion = require('keystone').list('ActivityCompletion')
const Activity           = require('keystone').list('Activity')
const ActivityList       = require('keystone').list('ActivityList')
const Location           = require('keystone').list('Location')
const R                  = require('ramda')
const ActivitySuggester  = require('../../activitySuggester')
const helpers            = require('../../chatHelpers')
const sleep              = require('../../utils').sleep
const allActions         = require('../')

const activityPromptOptions = (continued) => {
  let options = [
    {text: 'Eat', params: {activity_type: 'eat'}},
    {text: 'Drink', params: {activity_type: 'drink'}},
    {text: 'See', params: {activity_type: 'see'}},
    {text: 'Do', params: {activity_type: 'do'}}
  ]
  if (continued) {
    options = options.concat([{text: 'Home', params: {activity_type: 'finish'}}])
  }
  return {
    items: options,
    multi: false
  }
}

const actions = {
  'string:start': (payload, chatInterface) => {
    if (ch.isNewUser(payload.currentUser)) {
      chatInterface.send({
        text: i18n.t(`users.registration.greeting`)
      })
      return sleep(1000).then(() => {
        return ch.respondWith({
          text: i18n.t(`users.registration.request_name`),
          responseAction: `user:set_name`,
          responseType: `text`
        })
      })
    }
    const res = ch.respondWith({
      text: i18n.t('strings.start'),
      responseOptions: activityPromptOptions(),
      responseAction: 'string:set_activity_type',
      responseType: 'choice'
    })
    return Promise.resolve(res)
  },
  'string:set_activity_type': (payload, chatInterface) => {
    return helpers.checkSchema(payload, 'string:set_activity_type').then(() => {
      const { activity_type, continued } = payload.params
      if ( activity_type == 'finish') { return actions['string:finish'](payload, chatInterface) }

      const builder = new StringBuilder.model({
        user: payload.currentUser._id, activity_type: activity_type
      })
      chatInterface.send({
        text: i18n.t(`strings.type:${activity_type}.start_confirmation`)
      })
      let builderAction
      if (continued) {
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
          }, chatInterface)
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
      chatInterface.send({
        text: i18n.t(`strings.type:${builder.activity_type}.party_type:${payload.params.party_type}.finding_suggestions`),
        sentiment: 'friendly'
      })
      return sleep(1000).then(() => builder)
    }).then((builder) => {
      return findAndSuggestLocation(payload, {
        activity_type: builder.activity_type,
        party_type: builder.party_type,
        rejected: builder.rejected_locations
      }, chatInterface)
    })
  },
  'string:get_location_suggestions': (payload, chatInterface) => {
    return updateBuilder(payload, payload.params).then((builder) => {
      return findAndSuggestLocation(payload, {
        activity_type: builder.activity_type,
        party_type: builder.party_type,
        rejected: builder.rejected_locations
      }, chatInterface)
    })
  },
  'string:find_location': (payload, chatInterface) => {
    const response = payload.result.fulfillment.speech
    chatInterface.send(response)
    return sleep(1000).then(() => {
      const chatResponse = ch.respondWith({text: i18n.t('strings.ask_party_type')})
      return Promise.resolve(chatResponse)
    })
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
        return builder.rejectActivity(payload.params.activity).then((builder) => {
          return suggestActivity(builder, payload, chatInterface)
        })
      })
    }
  },
  'string:create_activity': (payload) => {
    helpers.checkSchema(payload, 'string:create_activity')
    let party_type
    return getBuilder(payload.currentUser._id).then((builder) => {
      if (!builder) { return Promise.reject(`No Builder is present for this user`) }
      return builder
    }).then((builder) => {
      party_type = builder.party_type
      return new Activity.model({
        location: payload.params.location,
        category: payload.params.category,
        description: payload.text,
        creator: payload.currentUser._id
      }).save().then((activity) => {
        return new ActivityCompletion.model({
          activity: activity._id,
          user: payload.currentUser._id,
          location: payload.params.location,
          party_type: party_type,
          activity_list: builder.activity_list
        }).save()
      })
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
          activity_completion: completion._id,
          activity: completion.activity
        },
        responseType: 'choice'
      })
    })
  },
  'string:continue': () => {
    return ch.respondWith({
      text: i18n.t('strings.continue'),
      responseOptions: activityPromptOptions(true),
      responseAction: 'string:set_activity_type',
      responseParams: {
        continued: true
      },
      responseType: 'choice'
    })
  },
  'string:finish': (payload) => {
    const finishedAt = Date.now()
    return StringBuilder.model.findOneAndUpdate(
      {user: payload.currentUser, finishedAt: null},
      {$set: {finishedAt: finishedAt}},
      {sort: '-createdAt', new: true}
    ).then((builder) => {
      return ActivityList.model.findOneAndUpdate(
        {_id: builder.activity_list},
        {$set: {finishedAt: finishedAt}}
      )
    }).then(() => {
      return ch.respondWith({
        text: i18n.t(`strings.finished`),
        responseOptions: {
          items: [
            {text: i18n.t('strings.prompt'), params: {}}
          ],
          multi: false
        },
        responseAction: 'string:start',
        responseType: 'choice'
      })
    })
  },
  'string:handle_location_addition': (payload) => {
    const { params } = payload
    if (params.add_location) {
      return Promise.resolve().then(() => {
        return ch.respondWith({
          text: null,
          visible: false,
          responseAction: 'string:handle_location_selection',
          responseType: 'location'
        })
      })
    } else {
      return Promise.resolve(actions['string:continue']())
    }
  },
  'string:handle_location_selection': (payload, chatInterface) => {
    return getBuilder(payload.currentUser).then((builder) => {
      return Places.getDetails(payload.location).then((details) => {
        const safeAttrs = {
          name: details.name,
          info: details.info,
          primaryCategory: builder.activity_type
        }
        payload = Object.assign(payload, {params: {activity_type: builder.activity_type}})
        return LocationSearcher.findOrCreateLocation(payload.location, safeAttrs).then((location) => {
          // merge ID with google details
          details.id  = location.id
          details._id = location.id
          return details
        }).then((location) => {
          return updateBuilder(payload, {
            last_location: location._id
          })
        }).then((builder) => {
          return suggestActivity(builder, payload, chatInterface)
        })
      })
    })
  },
  'string:prompt_activity_input': (payload) => {
    if (payload.params.provide_activity) {
      return sleep(500).then(() => promptActivityInput(payload))
    } else {
      return Promise.resolve(allActions.userActions['user:get_geo']({params: {nextAction: 'string:continue'}}))
    }
  }
}

const updateBuilder = (payload, attrs) => {
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
    return builder
  })
}

const getBuilder = (userId) => {
  return StringBuilder.model.find(
    {user: userId, finishedAt: null}).sort('-createdAt').exec().then((r) => {
      return r[0]
    }).then((builder) => {
      if (!builder.activity_list) {
        return new ActivityList.model({
          creator: userId,
          isKept: true
        }).save().then((list) => {
          return StringBuilder.model.findOneAndUpdate({_id: builder.id}, {
            $set: {activity_list: list}
          }, {new: true})
        })
      }
      return builder
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
        party_type: builder.party_type,
        activity_list: builder.activity_list
      })

      return completion.save()
    })
  }).then((completion) => {
    chatInterface.send({
      text: i18n.t(`strings.type:${payload.params.activity_type}.successful_activity_suggestion`)
    })
    return sleep(1000).then(() => {
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
    })
  })
}

function rejectSuggestion(payload, chatInterface) {
  const rejected = [].concat(payload.params.location)
  return getBuilder(payload.currentUser._id).then((builder) => {
    chatInterface.send({
      text: i18n.t(`strings.type:${builder.activity_type}.party_type:${builder.party_type}.rejected_suggestion_acknowledgement`)
    })
    return sleep(1000).then(() => builder)
  })
  .then((builder) => {
    return builder.rejectLocations(rejected).then(() => builder)
  })
  .then((builder) => {
    return findAndSuggestLocation(payload, {
      activity_type: builder.activity_type,
      party_type: builder.party_type,
      rejected: builder.rejected_locations,
      userLocation: payload.userLocation
    }, chatInterface)
  })
}

function acceptSuggestion(payload, chatInterface) {
  return getBuilder(payload.currentUser._id).then((builder) => {
    chatInterface.send({
      text: i18n.t(`strings.type:${builder.activity_type}.successful_suggestion`)
    })
    return sleep(2000).then(() => {
      return suggestActivity(builder, payload, chatInterface)
    })
  })
}

const suggestActivity = (builder, payload) => {
  return ActivitySuggester.suggest({
    activity_type: builder.activity_type,
    location: builder.last_location,
    rejected: builder.rejected_activities
  }).then((activity) => {
    return updateBuilder(payload, {last_activity: activity._id}).then(() => activity)
  }).then((activity) => {
    return ch.respondWith({
      text: i18n.t(`strings.type:${builder.activity_type}.suggest_activity`),
      media: [
        {
          type: 'quote',
          data: activity.description,
          creator: activity.creator.name
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
  }).catch((err) => {
    if (err && err.noActivities) {
      return ch.respondWith({
        text: i18n.t('errors.no_activities', {
          activity_type: payload.params.activity_type
        }),
        responseAction: 'string:prompt_activity_input',
        responseType: 'choice',
        responseOptions: {
          items: [
            {
              text: 'Sure',
              params: {
                provide_activity: true, activity_type: builder.activity_type,
                location: builder.last_location
              }
            },
            { text: 'Nah, do something else.', params: {provide_activity: false} }
          ]
        }
      })
    }
  })
}

function findAndSuggestLocation(payload, criteria) {
  criteria = Object.assign(criteria, {userLocation: payload.userLocation})
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
  }).catch((err) => {
    if (err.code == 404) {
      return ch.respondWith({
        text: err.text,
        responseType: 'choice',
        responseOptions: {
          items: [
            {text: 'Choose my own', params: {add_location: true}},
            {text: 'Do something else', params: {add_location: false}}
          ],
          multi: false
        },
        responseAction: `string:handle_location_addition`
      })
    } else {
      return sleep(1500).then(() => Promise.resolve(
        allActions.userActions['user:get_geo']({params: {nextAction: 'string:continue'}})
      ))
    }
  })
}

const promptActivityInput = (payload) => {
  return getBuilder(payload.currentUser._id).then((builder) => {
    return Location.model.findOne({_id: builder.last_location}).exec().then((location) => {
      return ch.respondWith({
        text: i18n.t(`strings.type:${builder.activity_type}.prompt_activity`),
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
