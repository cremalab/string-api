const i18n               = require('../../../config/i18n')
const ch                 = require('../../chatHelpers')
const allActions         = require('../')
const helpers            = require('../../chatHelpers')
const keystone           = require('keystone')
const ActivityCompletion = keystone.list('ActivityCompletion')

const actions = {
  'activity:add_image': (payload) => {
    const res = ch.respondWith({
      text: `Feature not yet implemented!`
    })
    return Promise.resolve(res)
  },
  'activity:handle_image_choice': (payload, chatInterface) => {
    let photoAction
    if (payload.params.takePhoto) {
      chatInterface.send({
        text: `Feature not yet implemented!`
      })
      photoAction = Promise.resolve()
    } else {
      chatInterface.send({
        text: i18n.t('activities.declined_photo_upload')
      })
      photoAction = Promise.resolve()
    }
    return photoAction.then(() => {
      return ch.respondWith({
        text: i18n.t('activities.prompt_recommendation'),
        responseAction: `activity:set_recommendation`,
        responseOptions: {
          items: [
            {text: `👍`, params: {recommended: 'yes'}},
            {text: `👎`, params: {recommended: 'no'}}
          ]
        },
        responseParams: {
          activity: payload.params.activity,
          activity_completion: payload.params.activity_completion
        }
      })
    })
  },
  'activity:set_recommendation': (payload, chatInterface) => {
    return helpers.checkSchema(payload, 'activity:set_recommendation').then(() => {
      return ActivityCompletion.model.findOne(
        {_id: payload.params.activity_completion}
      )
    }).then((completion) => {
      completion.recommended = payload.params.recommended
      return completion.save()
    }).then((completion) => {
      console.log('COMPLETION UPDATED')
      chatInterface.send({
        text: i18n.t(`activities.acknowledge_recommendation.${completion.recommended ? 'positive' : 'negative'}`)
      })
      return Promise.resolve(allActions.stringActions['string:continue']())
    })
  }
}


module.exports = actions
