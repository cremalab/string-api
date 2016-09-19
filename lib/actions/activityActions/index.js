const i18n               = require('../../../config/i18n')
const ch                 = require('../../chatHelpers')
const allActions         = require('../')
const helpers            = require('../../chatHelpers')
const keystone           = require('keystone')
const ActivityCompletion = keystone.list('ActivityCompletion')
const cloudinaryActions  = require('../../cloudinaryActions')
const sleep              = require('../../utils').sleep


const recommendationPrompt = (payload) => {
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
}

const actions = {
  'activity:add_image': (payload, chatInterface) => {
    return helpers.checkSchema(payload, 'activity:add_image').then(() => {
      return ActivityCompletion.model.findOneAndUpdate({
        _id: payload.params.activity_completion
      }, {
        $set: {
          image: payload.params.media
        }
      }, {
        new: true
      }).then(() => {
        chatInterface.send({text: i18n.t('activities.image_received')})
        return sleep(1000).then(() => {
          return Promise.resolve(recommendationPrompt(payload))
        })
      })
    })
  },
  'activity:handle_image_choice': (payload, chatInterface) => {
    return helpers.checkSchema(payload, 'activity:handle_image_choice').then(() => {
      if (payload.params.takePhoto) {
        return ch.respondWith({
          text: undefined,
          visible: false,
          responseType: 'media',
          responseAction: 'activity:add_image',
          responseParams: {
            activity: payload.params.activity,
            activity_completion: payload.params.activity_completion
          },
          mediaParams: cloudinaryActions.generateUploadParams()
        })
      } else {
        chatInterface.send({
          text: i18n.t('activities.declined_photo_upload')
        })
        return sleep(1000).then(() => {
          return Promise.resolve(recommendationPrompt(payload))
        })
      }
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
      chatInterface.send({
        text: i18n.t(`activities.acknowledge_recommendation.${completion.recommended == 'yes' ? 'positive' : 'negative'}`)
      })
      return sleep(1000).then(() => Promise.resolve(
        allActions.userActions['user:get_geo']({params: {nextAction: 'string:continue'}}))
      )
    })
  }
}


module.exports = actions
