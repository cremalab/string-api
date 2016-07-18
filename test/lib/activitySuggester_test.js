'use strict'
const ActivitySuggester = require('../../lib/activitySuggester')
const helpers  = require('../testHelpers')
const keystone = require('../keystoneTestHelper')
const expect   = require('chai').expect

const app = keystone.app

let listRecord, locationRecord, activityRecord, userRecord;

describe.only('activitySuggester', function() {
  before(() => {
    return Promise.all([helpers.cleanUp(), helpers.stubAuthUser()]).then((values) => {
      userRecord = values[1]
      return helpers.stubActivity(userRecord).then((ac) => {
        activityRecord = ac
        return ac
      })
    })
  })
  describe('suggest', () => {
    it('should reject if no location_id', () => {
      expect(() => ActivitySuggester.suggest({activity_type: 'eat'})).to.throw.rejected
    })
    it('should reject if no activity_type', () => {
      expect(() => ActivitySuggester.suggest({location_id: '111aaa'})).to.throw.rejected
    })
    it('should return a promise', () => {
      expect(() => ActivitySuggester.suggest({location_id: '111aaa'})).to.resolve
    })
    it('should return an Activity', () => {
      return ActivitySuggester.suggest({
        location_id: activityRecord.location,
        activity_type: 'eat'
      }).then((activity) => {
        expect(activity).to.be.an('object')
        expect(activity.location).to.equal(activityRecord.location)
      })
    })
  })
});
