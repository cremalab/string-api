const ch                 = require('../../chatHelpers')
const i18n               = require('../../../config/i18n')
const allActions         = require('../')
const sleep              = require('../../utils').sleep
const keystone           = require('keystone')

const actions = {
  // Used to request most recent geo location of user
  'user:get_geo': (payload) => {
    return ch.respondWith({
      text: undefined,
      visible: false,
      responseType: `userLocation`,
      responseAction: 'user:set_geo',
      responseParams: {
        continued: true,
        nextAction: payload.params.nextAction
      }
    })
  },
  // Now we've got an updated userLocation, continue with next action
  'user:set_geo': (payload, chatInterface) => {
    let actions
    // TODO: refactor. currently like this to avoid circular dependency
    if (payload.params.nextAction.split(':')[0] == 'user') {
      actions = allActions.userActions
    } else {
      actions = allActions.stringActions
    }
    console.log(actions[payload.params.nextAction]);
    return Promise.resolve(actions[payload.params.nextAction](payload, chatInterface))
  },
  'user:setup': (payload, chatInterface) => {
    chatInterface.send({
      text: i18n.t(`users.registration.greeting`)
    })
    return sleep(1000).then(() => {
      return chatInterface.send({
        text: i18n.t(`users.registration.greeting2`)
      })
    }).then(() => sleep(2000)).then(() => {
      return ch.respondWith({
        text: i18n.t(`users.registration.greeting3`),
        responseAction: `user:respond_with_first_choice`,
        responseType: `choice`,
        responseOptions: {
          items: [
            {text: `Like this?`, params: {understood: true}}
          ],
          multi: false
        }
      })
    })
  },
  'user:respond_with_first_choice': (payload, chatInterface) => {
    return sleep(500).then(() => {
      chatInterface.send({
        text: i18n.t(`users.registration.greeting4`)
      })
      return sleep(1000)
    }).then(() => {
      chatInterface.send({
        text: i18n.t(`users.registration.greeting5`)
      })
      return sleep(2000)
    }).then(() => {
      return ch.respondWith({
        text: i18n.t(`users.registration.request_geo_permission`),
        responseType: `choice`,
        responseAction: `user:respond_to_geo_permission`,
        responseOptions: {
          items: [
            {text: 'Yep, sounds good', params: {accept: true}},
            {text: 'Not now', params: {accept: false}}
          ],
          multi: false
        }
      })
    })
  },
  'user:respond_to_geo_permission': (payload, chatInterface) => {
    if (payload.params.accept) {
      return Promise.resolve().then(() => {
        return ch.respondWith({
          text: i18n.t(`users.registration.request_geo_permission_confirm`),
          responseType: `userLocation`,
          responseAction: 'user:set_geo',
          responseParams: {
            nextAction: `user:set_preferences`
          }
        })
      })
    }
    return sleep(1000).then(() => {
      return Promise.resolve().then(() => setPreferences(payload,chatInterface))
    })
  },
  'user:set_preferences': (payload, chatInterface) => {
    return setPreferences(payload,chatInterface)
  },
  'user:set_food_preference': (payload, chatInterface) => {
    return keystone.list('User').model.findOneAndUpdate(
      {_id: payload.currentUser},
      {food_preference: payload.params.food_type }
    ).then(() => {
      chatInterface.send({
        text: i18n.t(`misc.confirmations.neutral`)
      })
      return sleep(1000).then(() => {
        return ch.respondWith({
          text: i18n.t(`users.registration.preferences.drink_types`),
          responseType: `choice`,
          responseAction: `user:set_drink_preference`,
          responseOptions: {
            items: [
              {text: `Coffee`, params: {drink_type: `coffee`}},
              {text: `Juice`, params: {drink_type: `juice`}},
              {text: `Tea`, params: {drink_type: `tea`}},
              {text: `Soda`, params: {drink_type: `soda`}},
              {text: `Cocktails`, params: {drink_type: `cocktails`}},
              {text: `Wine`, params: {drink_type: `wine`}},
              {text: `Beer`, params: {drink_type: `beer`}}
            ],
            multi: true,
            submissionText: `Done`
          }
        })
      })
    })
  },
  'user:set_drink_preference': (payload, chatInterface) => {
    return keystone.list('User').model.findOneAndUpdate(
      {_id: payload.currentUser},
      {drink_preference: payload.params.drink_type}
    ).then(() => {
      chatInterface.send({
        text: i18n.t(`misc.confirmations.neutral`)
      })
      return sleep(1000).then(() => {
        return ch.respondWith({
          text: i18n.t(`users.registration.preferences.see_types`),
          responseType: `choice`,
          responseAction: `user:set_see_preference`,
          responseOptions: {
            items: [
              {text: `Monuments`, params: {see_type: `monuments`}},
              {text: `Gardens`, params: {see_type: `gardens`}},
              {text: `Museums`, params: {see_type: `museums`}},
              {text: `Art Galleries`, params: {see_type: `art_galleries`}}
            ],
            multi: true,
            submissionText: `Done`
          }
        })
      })
    })
  },
  'user:set_see_preference': (payload, chatInterface) => {
    return keystone.list('User').model.findOneAndUpdate(
      {_id: payload.currentUser},
      {see_preference: payload.params.see_type}
    ).then(() => {
      chatInterface.send({
        text: i18n.t(`misc.confirmations.neutral`)
      })
      return sleep(1000).then(() => {
        return ch.respondWith({
          text: i18n.t(`users.registration.preferences.do_types`),
          responseType: `choice`,
          responseAction: `user:set_do_preference`,
          responseOptions: {
            items: [
              {text: `Parks`, params: {do_type: `monuments`}},
              {text: `Amusement Parks`, params: {do_type: `amusement_parks`}},
              {text: `Outdoor Adventures`, params: {do_type: `outdoor`}},
              {text: `Sports`, params: {do_type: `sports`}},
              {text: `Music`, params: {do_type: `music`}}
            ],
            multi: true,
            submissionText: `Done`
          }
        })
      })
    })
  },
  'user:set_do_preference': (payload, chatInterface) => {
    return keystone.list('User').model.findOneAndUpdate(
      {_id: payload.currentUser},
      {do_preference: payload.params.do_type}
    ).then(() => {
      chatInterface.send({
        text: i18n.t(`users.registration.preferences.finished`)
      })
      return sleep(1000).then(() => {
        return ch.respondWith({
          text: i18n.t(`users.registration.preferences.start_string`),
          responseType: `choice`,
          responseAction: `string:start`,
          responseOptions: {
            items: [
              {text: `Let's go!`, params: {}}
            ],
            multi: false
          }
        })
      })
    })
  }
}

// Abstracted methods

function setPreferences(payload, chatInterface) {
  chatInterface.send({
    text: i18n.t(`users.registration.preferences.intro`)
  })
  return sleep(2000).then(() => {
    return ch.respondWith({
      text: i18n.t(`users.registration.preferences.food_types`),
      responseType: `choice`,
      responseAction: `user:set_food_preference`,
      responseOptions: {
        items: [
          {text: `Italian`, params: {food_type: `italian`}},
          {text: `Seafood`, params: {food_type: `seafood`}},
          {text: `BBQ`, params: {food_type: `bbq`}},
          {text: `Asian`, params: {food_type: `asian`}},
          {text: `Mexican`, params: {food_type: `mexican`}},
          {text: `American`, params: {food_type: `american`}},
          {text: `Mediterranean`, params: {food_type: `mediterranean`}}
        ],
        multi: true,
        submissionText: `Done`
      }
    })
  })
}


module.exports = actions
