'use strict'
const LocationSearcher = require('../../lib/locationSearcher')
const helpers  = require('../testHelpers')
const keystone = require('../keystoneTestHelper');
const expect   = require('chai').expect

const app = keystone.app;

let listRecord, locationRecord, activityRecord, userRecord;

describe('locationSearcher', function() {
  before(() => {
    return Promise.all([helpers.cleanUp(), helpers.stubAuthUser()]).then((values) => {
      userRecord = values[1]
      return helpers.stubActivity(userRecord)
    })
  })
  describe('findOne', () => {
    it('should reject if no activity matches', () => {
      expect(LocationSearcher.findOne({activity_type: 'trees'})).to.be.rejected
    })
    it('should resolve one location', () => {
      return LocationSearcher.findOne({activity_type: 'eat'}).then((location) => {
        expect(location).to.be.an('object')
        expect(Object.keys(location)).to.include('name')
      })
    })
  })
});
