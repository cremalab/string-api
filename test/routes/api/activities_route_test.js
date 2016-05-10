'use strict'
const request  = require('supertest');
const helpers  = require('../../testHelpers')
const keystone = require('../../keystoneTestHelper');
const expect   = require('chai').expect

const app = keystone.app;

let listRecord, locationRecord, activityRecord, userRecord;

describe('Activities Route', function() {
  beforeEach( (done) => {
    return Promise.all([
      helpers.cleanUp(),
      helpers.stubLocation(),
      helpers.stubAuthUser()
    ]).then((values) => {
      locationRecord = values[1]
      userRecord     = values[2]
      return Promise.all([helpers.stubList(userRecord), helpers.stubActivity(userRecord)]).then((values) => {
        listRecord     = values[0]
        activityRecord = values[1]
        done()
      })
    })
  })

  it('should return array for index', (done) => {
    request(app)
      .get("/api/activities")
      .set({"Authorization": userRecord.generateAuthToken() })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200);  //  Expect http response
        expect(res.body.activities).to.be.an('array');
        done()
      })
  });

  it('should return object for show', function(done) {
    request(app)
      .get(`/api/activities/${activityRecord._id}`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
        expect(res.body).to.be.a('object');
        expect(res.body.activity).to.be.an('object');
        expect(res.body.activity.location).to.be.an('object');
        done()
      })
  })

  it('should return error when creating with empty params', function(done) {
    request(app)
      .post(`/api/activities`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .send({})
      .end( (err, res) => {
        expect(res.statusCode).to.equal(422)
        done()
      })
  })

  it('should create new activity', function(done) {
    request(app)
      .post(`/api/activities`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .send({
        description: "Ate 10 tacos",
        activity_list: listRecord._id,
        location: locationRecord._id
      })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(201)  //  Expect http response status code to be 200 ("Ok")
        expect(res.body).to.be.an('object')
        expect(res.body.activity).to.be.an('object')
        expect(res.body.activity.description).to.not.be.null
        expect(res.body.activity._id).to.not.be.null
        done()
      })
  })

  it('update activity', function(done) {
    request(app)
      .put(`/api/activities/${activityRecord._id}`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .send({
        description: "Ate 500 tacos"
      })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200)  //  Expect http response status code to be 200 ("Ok")
        expect(res.body).to.be.an('object')
        expect(res.body.activity).to.be.an('object')
        expect(res.body.activity.description).to.not.be.null
        expect(res.body.activity.description).to.equal('Ate 500 tacos')
        expect(res.body.activity._id).to.not.be.null
        done()
      })
  })

  it('delete activity', function(done) {
    request(app)
      .delete(`/api/activities/${activityRecord._id}`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200);
        keystone.list('Activity').model.findOne({id: activityRecord.id}, (err, activity) => {
          expect(activity).to.be.null
          done()
        })
      })
  })

});
