'use strict'
const actions       = require('../../lib/chatActions')
const expect        = require('chai').expect
const helpers       = require('../testHelpers')
const i18n          = require('../../config/i18n')
const keystone      = require('keystone')
const StringBuilder = keystone.list('StringBuilder')

const chatInterface = {
  send: (msg) => msg
}

describe.only('stringActions', function() {
  describe('string:start', () => {
    it('should return a text prompt', () => {
      return actions.handle('string:start', {}).then((res) => {
        expect(res).to.be.an('object')
        expect(res.text).to.contain(i18n.t('strings.start'))
      })
    })
    it('should return choices', () => {
      return actions.handle('string:start', {}).then((res) => {
        expect(res.responseOptions).to.be.ok
        expect(res.responseOptions).to.be.an('Object')
        expect(res.responseOptions.items).to.be.ok
        expect(res.responseOptions.items).to.be.an('Array')
      })
    })
  })

  describe('string:set_activity_type', () => {
    let userRec
    before(() => {
      helpers.stubAuthUser().then((user) => {
        userRec = user
      })
    })
    it('should return an error when missing params', (done) => {
      actions.handle('string:set_activity_type', {
        currentUser: userRec,
        params: {}
      }, chatInterface).catch(() => done())
    })
    it('should return a choice prompt', () => {
      return actions.handle('string:set_activity_type', {
        currentUser: userRec,
        params: {
          activity_type: 'eat'
        }
      }, chatInterface).then((res) => {
        expect(res).to.be.an('object')
        expect(res.responseType).to.equal('choice')
        expect(res.responseOptions).to.be.ok
        expect(res.responseOptions).to.be.an('Object')
        expect(res.responseOptions.items).to.be.an('Array')
      })
    })
    it(`should update the user's builder`, () => {
      return actions.handle('string:set_activity_type', {
        currentUser: userRec,
        params: {
          activity_type: 'see'
        }
      }, chatInterface)
      .then(() => {
        return StringBuilder.model.findOne({user: userRec._id}, {}, {sort: { 'createdAt': -1 }})
      }).then((builder) => {
        expect(builder.activity_type).to.equal('see')
      })
    })
  })

})
