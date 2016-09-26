const ch                 = require('../../chatHelpers')
const i18n               = require('../../../config/i18n')
const allActions         = require('../')
const sleep              = require('../../utils').sleep

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
  'user:set_food_preference': (payload) => {
    return Promise.resolve(ch.respondWith({
      text: `Yay! You did it! You responded with ${payload.params.food_type}!`,
      responseType: `choice`,
      responseAction: `user:`
    }))
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
