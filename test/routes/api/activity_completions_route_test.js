'use strict'

const request  = require('supertest');
const helpers  = require('../../testHelpers')
const keystone = require('../../keystoneTestHelper');
const expect   = require('chai').expect
const Activity = keystone.list('Activity').model

const app = keystone.app;

let listRecord, locationRecord, activityRecord, userRecord, completionRecord;

describe('Locations Route', function() {
  beforeEach( function(done) {
    Promise.all([
      helpers.cleanUp(),
      helpers.stubLocation(),
      helpers.stubAuthUser()
    ]).then((values) => {
      locationRecord = values[1]
      userRecord     = values[2]
      Promise.all([helpers.stubList(userRecord), helpers.stubActivity(userRecord)]).then((values) => {
        listRecord     = values[0]
        activityRecord = values[1]
        helpers.stubActivityCompletion(activityRecord, userRecord).then((completion) => {
          completionRecord = completion
          done()
        })
      })
    })
  })

  it('creates completion', (done) => {

    let act = new Activity({
      creator: userRecord._id,
      activity_list: listRecord._id,
      location: locationRecord,
      description: "Did the hokey-pokey"
    })

    act.save((err, activity) => {
      request(app)
        .post("/api/activity_completions")
        .set({"Authorization": userRecord.generateAuthToken() })
        .send({
          activity: activity._id
        })
        .end( (err, res) => {
          expect(res.statusCode).to.equal(201)
          expect(res.body).to.be.an('object')
          expect(res.body.activity_completion).to.be.an('object')
          expect(res.body.activity_completion._id).to.not.be.undefined
          done()
        })
    })

  })

  it('should fail on duplicate completion', function(done) {
    request(app)
      .post("/api/activity_completions")
      .set({"Authorization": userRecord.generateAuthToken() })
      .send({
        activity: completionRecord.activity
      })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(422)
        expect(res.body).to.be.an('object')
        expect(res.body.activity_completion).to.be.undefined
        done()
      })
  })

  it('should delete completions', function(done) {
    request(app)
      .delete(`/api/activity_completions/${completionRecord._id}`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('object')
        done()
      })
  })

})
