'use strict'

const request  = require('supertest')
const helpers  = require('../../testHelpers')
const keystone = require('../../keystoneTestHelper')
const expect   = require('chai').expect


describe('Users Route', function() {
  beforeEach( (done) => {
    helpers.cleanUp().then(() => done())
  })

  it('should throw error on empty payload', (done) => {
    request(keystone.app)
      .post('/api/users')
      .send({})
      .end( (err, res) => {
        expect(res.statusCode).to.equal(400)
        done()
      })
  })

  it('should create with a valid payload', (done) => {
    request(keystone.app)
      .post('/api/users')
      .send({
        phone: 9999999999
      })
      .end( (err, res) => {
        expect(res.statusCode).to.equal(201)
        expect(res.body).to.be.an('object')
        expect(res.body.user).to.be.an('object')
        expect(res.body.user._id).to.not.be.null
        expect(res.body.user.tempToken).to.not.be.null
        keystone.list('User').model.findOne({}, (err, user) => {
          expect(user.verificationCode).to.not.be.undefined
          done()
        })
      })
  })

  it('should require auth for put', (done) => {
    helpers.stubAuthUser().then(() => {
      request(keystone.app)
        .put(`/api/users`)
        .send({
          name: 'Boaty McBoatface'
        })
        .end( (err, res) => {
          expect(res.statusCode).to.equal(401)
          done()
        })
    })
  })

  it('should update user with put', (done) => {
    helpers.stubAuthUser().then((userRecord) => {
      request(keystone.app)
        .put(`/api/users`)
        .set({'Authorization': userRecord.generateAuthToken() })
        .send({
          name: 'Boaty McBoatface'
        })
        .end( (err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body.user.name).to.equal('Boaty McBoatface')
          done()
        })
    })
  })

})
