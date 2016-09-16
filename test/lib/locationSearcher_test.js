'use strict'
const LocationSearcher = require('../../lib/locationSearcher')
const helpers  = require('../testHelpers')
const keystone = require('../keystoneTestHelper')
const expect   = require('chai').expect
const Location = keystone.list('Location')

// const app = keystone.app

let userRecord

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
    it('should find locations within radius if sent coordinates', () => {
      return LocationSearcher.findOne({
        activity_type: 'eat',
        userLocation: {
          coords: {
            latitude: 39.064226,
            longitude: -94.585821
          }
        }
      }).then((location) => {
        expect(location).to.be.an('object')
        expect(Object.keys(location)).to.include('name')
      })
    })
    it('should fall back searching locations if no activities found', () => {
      return new Location.model({
        name: `McDonald's`,
        placeId: `ChIJAx0KfzO0j4ARXopQFds_wRQ`,
        primaryCategory: 'eat',
        info: {
          geo: [-122.040872, 37.338132]
        }
      }).save().then(() => {
        return LocationSearcher.findOne({
          activity_type: 'eat',
          userLocation: {
            // 1 Infinite Loop, Cupertino, CA
            coords: {
              latitude: 37.331948,
              longitude: -122.030186
            }
          }
        }).then((location) => {
          expect(location).to.be.an('object')
          expect(Object.keys(location)).to.include('name')
        })
      })
    })
  })
})
