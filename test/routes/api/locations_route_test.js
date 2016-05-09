'use strict'

const request  = require('supertest');
const helpers  = require('../../testHelpers')
const keystone = require('../../keystoneTestHelper');
const expect   = require('chai').expect

const app = keystone.app;

let locationRec, userRecord;

describe('Locations Route', function() {
  beforeEach( (done) => {
    Promise.all([
      helpers.cleanUp(),
      helpers.stubLocation(),
      helpers.stubAuthUser()
    ]).then((values) => {
      locationRec = values[1]
      userRecord  = values[2]
      done()
    })
  })

  it('requires auth', (done) => {
    request(app)
      .get("/api/locations")
      .end( (err, res) => {
        expect(res.statusCode).to.equal(401);
        done()
      })
  })

  it('list locations', (done) => {
    request(app)
      .get("/api/locations")
      .set({"Authorization": userRecord.generateAuthToken() })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
        expect(res.body.locations).to.be.an('array');
        done()
      })
  })

  it('show a location with details', function(done) {
    this.timeout(5000);
    request(app)
      .get(`/api/locations/${locationRec.id}`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(200)  //  Expect http response status code to be 200 ("Ok")
        expect(res.body).to.be.an('object')
        expect(res.body.location).to.be.an('object')
        expect(res.body.location.name).to.not.be.undefined
        done()
      })
  })

  it('should create new locations', function(done) {
    this.timeout(5000);
    request(app)
      .post(`/api/locations`)
      .set({"Authorization": userRecord.generateAuthToken() })
      .send({
        placeId: "ChIJ99ro0TzvwIcRZ4gy5tGQ_4o" // Burger King!
      })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(201)  //  Expect http response status code to be 200 ("Ok")
        expect(res.body).to.be.an('object')
        expect(res.body.location).to.be.an('object')
        expect(res.body.location.id).to.not.be.undefined
        expect(res.body.location.name).to.not.be.undefined
        expect(res.body.location.place_id).to.not.be.undefined
        done()
      })
  })

})
