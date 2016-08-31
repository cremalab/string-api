const i18n               = require('../../../config/i18n')
const ch                 = require('../../chatHelpers')
const allActions = require('../')

const actions = {
  'activity:add_image': (payload) => {
    const res = ch.respondWith({
      text: `Feature not yet implemented!`
    })
    return Promise.resolve(res)
  },
  'activity:handle_image_choice': (payload) => {
    if (!payload.params.takePhoto) {
      ch.respondWith({
        text: `Feature not yet implemented!`
      })
      return Promise.resolve(allActions.stringActions['string:continue']())
    }

    ch.respondWith({
      text: i18n.t('activities.declined_photo_upload')
    })
    return Promise.resolve(allActions.stringActions['string:continue']())
  }
}


module.exports = actions
