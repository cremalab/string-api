'use strict'
const actions            = require('../../lib/chatActions')
const expect             = require('chai').expect
const helpers            = require('../testHelpers')
const i18n               = require('../../config/i18n')
const keystone           = require('keystone')
const StringBuilder      = keystone.list('StringBuilder')
const ActivityCompletion = keystone.list('ActivityCompletion')

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

  describe('string:set_party_type', () => {
    let userRec
    before(() => {
      return helpers.stubAuthUser().then((user) => {
        userRec = user
        return helpers.stubActivity(userRec)
      })
    })
    it('should return an error when missing params', (done) => {
      actions.handle('string:set_party_type', {
        currentUser: userRec,
        params: {}
      }, chatInterface).catch(() => {done()})
    })
    it('should return a location suggestion', () => {
      return new StringBuilder.model({user: userRec, activity_type: 'eat'}).save()
      .then(() => {
        return actions.handle('string:set_party_type', {
          currentUser: userRec,
          params: {
            party_type: 'date'
          }
        }, chatInterface)
      }).then((res) => {
        expect(res).to.be.an('object')
        expect(res.responseType).to.equal('choice')
        expect(res.responseOptions).to.be.ok
        expect(res.responseOptions).to.be.an('Object')
        expect(res.responseOptions.items).to.be.an('Array')
        expect(res.responseAction).to.equal('string:respond_to_location_suggestion')
      })
    })
    it(`should update the user's builder`, () => {
      return new StringBuilder.model({user: userRec, activity_type: 'eat'}).save()
      .then(() => {
        return actions.handle('string:set_party_type', {
          currentUser: userRec,
          params: {
            party_type: 'solo'
          }
        }, chatInterface)
      }).then(() => {
        return StringBuilder.model.findOne({user: userRec._id}, {}, {sort: { 'createdAt': -1 }})
      }).then((builder) => {
        expect(builder.party_type).to.equal('solo')
      })
    })
  })

  describe('string:respond_to_location_suggestion', () => {
    let userRec, locationRec
    before(() => {
      return helpers.stubAuthUser().then((user) => {
        userRec = user
        return helpers.stubActivity(userRec).then((activity) => {
          locationRec = activity.location
          return locationRec
        })
      })
    })
    it('should return an activity suggestion when accepted', () => {
      return new StringBuilder.model({
        user: userRec,
        activity_type: 'eat',
        party_type: 'solo',
        last_location: locationRec
      }).save()
      .then(() => {
        return actions.handle('string:respond_to_location_suggestion', {
          currentUser: userRec,
          params: {accepted: true}
        }, chatInterface)
      }).then((res) => {
        expect(res).to.be.an('object')
        expect(res.responseType).to.equal('choice')
        expect(res.responseOptions).to.be.ok
        expect(res.responseOptions).to.be.an('Object')
        expect(res.responseOptions.items).to.be.an('Array')
        expect(res.responseAction).to.equal('string:respond_to_activity_suggestion')
      })
    })
    it('should return a location suggestion when rejected', () => {
      return new StringBuilder.model({
        user: userRec,
        activity_type: 'eat',
        party_type: 'solo',
        last_location: locationRec
      }).save()
      .then(() => {
        return actions.handle('string:respond_to_location_suggestion', {
          currentUser: userRec,
          params: {accepted: false}
        }, chatInterface)
      }).then((res) => {
        expect(res).to.be.an('object')
        expect(res.responseType).to.equal('choice')
        expect(res.responseOptions).to.be.ok
        expect(res.responseOptions).to.be.an('Object')
        expect(res.responseOptions.items).to.be.an('Array')
        expect(res.responseAction).to.equal('string:respond_to_location_suggestion')
      })
    })
  })

  describe('string:respond_to_activity_suggestion', () => {
    let userRec, locationRec, activityRec
    before(() => {
      return helpers.stubAuthUser().then((user) => {
        userRec = user
        return helpers.stubActivity(userRec).then((activity) => {
          locationRec = activity.location
          activityRec = activity
          return locationRec
        })
      })
    })
    it('should return a continued prompt when accepted', () => {
      return new StringBuilder.model({
        user: userRec,
        activity_type: 'eat',
        party_type: 'solo',
        last_location: locationRec
      }).save()
      .then(() => {
        return actions.handle('string:respond_to_activity_suggestion', {
          currentUser: userRec,
          params: {accepted: true, activity: `${activityRec._id}`, activity_type: 'eat'}
        }, chatInterface)
      }).then((res) => {
        expect(res.responseParams).to.be.ok
        expect(res.responseParams).to.have.key('continued')
        expect(res.responseParams.continued).to.be.true
      })
    })
    it('should create an ActivityCompletion when accepted', () => {
      return new StringBuilder.model({
        user: userRec,
        activity_type: 'eat',
        party_type: 'solo',
        last_location: locationRec
      }).save()
      .then(() => {
        return actions.handle('string:respond_to_activity_suggestion', {
          currentUser: userRec,
          params: {accepted: true, activity: `${activityRec._id}`, activity_type: 'eat'}
        }, chatInterface)
      }).then(() => {
        return ActivityCompletion.model.findOne({
          user: userRec._id, location: locationRec
        }, {}, {sort: '-createdAt'}).then((completion) => {
          expect(String(completion.location)).to.equal(String(locationRec))
          expect(completion.party_type).to.equal('solo')
        })
      })
    })
    it('should return an activity suggestion when rejected', () => {
      return new StringBuilder.model({
        user: userRec,
        activity_type: 'eat',
        party_type: 'solo',
        last_location: locationRec
      }).save()
      .then(() => {
        return actions.handle('string:respond_to_activity_suggestion', {
          currentUser: userRec,
          params: {accepted: false, activity: `${activityRec._id}`, activity_type: 'eat'}
        }, chatInterface)
      }).then((res) => {
        expect(res).to.be.an('object')
        expect(res.responseType).to.equal('choice')
        expect(res.responseOptions).to.be.ok
        expect(res.responseOptions).to.be.an('Object')
        expect(res.responseOptions.items).to.be.an('Array')
        expect(res.responseAction).to.equal('string:respond_to_activity_suggestion')
      })
    })
  })

})
