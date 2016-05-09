'use strict'

const request  = require('supertest');
const helpers  = require('../../testHelpers')
const keystone = require('../../keystoneTestHelper');
const expect   = require('chai').expect
const Activity = keystone.list('Activity').model

const app = keystone.app;

let listRecord, userRecord

describe('Locations Route', function() {
  beforeEach( function(done) {
    Promise.all([helpers.cleanUp(), helpers.stubAuthUser()]).then((values) => {
      userRecord = values[1]
      helpers.stubList(userRecord).then((list) => {
        listRecord = list
        done()
      })
    })
  })

  it('requires auth', (done) => {
    request(app)
      .get("/api/activity_lists")
      .end( (err, res) => {
        expect(res.statusCode).to.equal(401)
        done()
      })
  })

  it('should list activity lists', function(done) {
    request(app)
      .get("/api/activity_lists")
      .set({"Authorization": userRecord.generateAuthToken() })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('object')
        expect(res.body.lists).to.be.an('array')
        done()
      })
  })

  it('should return a list', function(done) {
    this.timeout(5000)
    request(app)
      .get(`/api/activity_lists/${listRecord._id}`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('object')
        expect(res.body.list).to.be.an('object')
        expect(res.body.list.activities).to.be.an('array')
        expect(res.body.list.activities[0].location).to.be.an('object')
        expect(res.body.userCompletions).to.be.an('array')
        done()
      })
  })

  it('should fail with empty payload', function(done) {
    request(app)
      .post("/api/activity_lists")
      .set({"Authorization": userRecord.generateAuthToken() })
      .send({})
      .end( (err, res) => {
        expect(res.statusCode).to.equal(422)
        done()
      })
  })

  it('should create a list with valid payload', function(done) {
    request(app)
      .post("/api/activity_lists")
      .set({"Authorization": userRecord.generateAuthToken() })
      .send({
        description: "#cheap #drinks in #midtown",
        isPublished: true
      })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(201)
        expect(res.body).to.be.an('object')
        expect(res.body.list).to.be.an('object')
        expect(res.body.list.description).to.not.be.null
        expect(res.body.list.isPublished).to.be.true
        done()
      })
  })


  it('should update a list', function(done) {
    request(app)
      .put(`/api/activity_lists/${listRecord._id}`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .send({
        description: "a fun Saturday",
        isPublished: true
      })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('object')
        expect(res.body.list).to.be.an('object')
        expect(res.body.list.description).to.not.be.null
        expect(res.body.list.description).to.equal('a fun Saturday')
        expect(res.body.list.isPublished).to.be.true
        done()
      })
  })


  it('should delete lists', function(done) {
    request(app)
      .delete(`/api/activity_lists/${listRecord._id}`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('object')
        done()
      })
  })

})
