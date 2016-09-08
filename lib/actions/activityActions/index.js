const i18n       = require('../../../config/i18n')
const ch         = require('../../chatHelpers')
const allActions = require('../')
const helpers    = require('../../chatHelpers')

const actions = {
  'activity:add_image': (payload) => {
    const res = ch.respondWith({
      text: `Feature not yet implemented!`
    })
    return Promise.resolve(res)
  },
  'activity:handle_image_choice': (payload, chatInterface) => {
    if (!payload.params.takePhoto) {
      chatInterface.send({
        text: `Feature not yet implemented!`
      })
      return Promise.resolve(allActions.stringActions['string:continue']())
    }
    chatInterface.send({
      text: i18n.t('activities.declined_photo_upload')
    })
    return ch.respondWith({
      text: i18n.t('activities.prompt_recommendation'),
      responseAction: `activity:set_recommendation`,
      responseOptions: {
        items: [
          {text: `👍`, params: {recommended: true}},
          {text: `👎`, params: {recommended: false}}
        ]
      },
      responseParams: {
        activity: payload.activity
      }
    })
  },
  'activity:set_recommendation': (payload, chatInterface) => {

    return Promise.resolve(allActions.stringActions['string:continue']())
  }
}


module.exports = actions
