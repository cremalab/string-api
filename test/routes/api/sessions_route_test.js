'use strict'

const request  = require('supertest');
const helpers  = require('../../testHelpers')
const keystone = require('../../keystoneTestHelper');
const expect   = require('chai').expect
const Activity = keystone.list('Activity').model

const app = keystone.app;

let unauthUserRecord

describe('Locations Route', function() {
  beforeEach( function(done) {
    Promise.all([helpers.cleanUp(), helpers.stubUnauthUser()]).then((values) => {
      unauthUserRecord = values[1]
      done()
    });
  })

  it('errors on empty POST', (done) => {
    request(app)
      .post("/api/sessions")
      .end( (err, res) => {
        expect(res.statusCode).to.equal(400)
        done()
      })
  })

  it('errors on invalid verificationCode', (done) => {
    request(app)
      .post("/api/sessions")
      .send({
        tempToken: unauthUserRecord.tempToken,
        verificationCode: 88888
      })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(403)
        done()
      })
  })


  it.only('should return an authToken on valid POST', function(done) {
    console.log(unauthUserRecord.verificationCode);
    request(app)
      .post("/api/sessions")
      .send({
        tempToken: unauthUserRecord.tempToken,
        verificationCode: unauthUserRecord.verificationCode
      })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(201)
        expect(res.body).to.be.an('object')
        expect(res.body.user.authToken).to.not.be.undefined
        expect(res.body.user.id).to.not.be.undefined
        expect(res.body.user.name).to.not.be.null
        done()
      })
  })

})
