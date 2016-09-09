'use strict'
const actions            = require('../../lib/chatActions')
const expect             = require('chai').expect
const helpers            = require('../testHelpers')
const i18n               = require('../../config/i18n')
const keystone           = require('keystone')
const ActivityCompletion = keystone.list('ActivityCompletion')
// const StringBuilder      = keystone.list('StringBuilder')
// const Activity           = keystone.list('Activity')

const chatInterface = {
  send: (msg) => msg
}

describe.only('activityActions', function() {
  let userRec, activityRec, completionRec
  describe('activity:set_recommendation', () => {
    before(() => {
      return helpers.stubAuthUser().then((user) => {
        userRec = user
        return helpers.stubActivity(userRec).then((activity) => {
          activityRec = activity
          return new ActivityCompletion.model({
            user: userRec,
            activity: activityRec,
            party_type: 'solo'
          }).save().then((completion) => {
            completionRec = completion
            return completion
          })
        })
      })
    })
    it('should error when missing params', () => {
      return actions.handle('activity:set_recommendation', {
        params: {
          recommended: true
        }
      }, chatInterface).should.eventually.be.rejected
    })

    it('should update completion with a recommendation', () => {
      return actions.handle('activity:set_recommendation', {
        params: {
          activity: `${activityRec._id}`,
          recommended: 'yes',
          activity_completion: `${completionRec._id}`
        },
        currentUser: userRec
      }, chatInterface).then((res) => {
        expect(res).to.be.an('object')
        return ActivityCompletion.model.findOne({_id: completionRec._id})
        .then((completion) => {
          expect(completion.recommended).to.equal('yes')
          expect(res.text).to.contain(i18n.t('strings.continue'))
        })
      })
    })
  })

  describe('activity:handle_image_choice', () => {
    before(() => {
      return helpers.stubAuthUser().then((user) => {
        userRec = user
        return helpers.stubActivity(userRec).then((activity) => {
          activityRec = activity
          return new ActivityCompletion.model({
            user: userRec,
            activity: activityRec,
            party_type: 'solo'
          }).save().then((completion) => {
            completionRec = completion
            return completion
          })
        })
      })
    })
    it('should error when missing params', () => {
      return actions.handle('activity:handle_image_choice', {
        params: {}
      }, chatInterface).should.eventually.be.rejected
    })

    it('should continue to recommendation prompt when declining image contribution', () => {
      return actions.handle('activity:handle_image_choice', {
        params: {
          takePhoto: false
        },
        currentUser: userRec
      }, chatInterface).then((res) => {
        expect(res).to.be.an('object')
        expect(res.text).to.contain(i18n.t('activities.prompt_recommendation'))
      })
    })
  })

})
