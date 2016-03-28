'use strict'

const Lab    = require("lab");           // load Lab module
const lab    = exports.lab = Lab.script(); //export test script
const Code   = require("code");      //assertion library
const server = require("../../server"); // our index.js from above
const Db     = require("../../database")
const stubList = require('./testHelpers').stubList
const cleanUp  = require('./testHelpers').cleanUp
const User = require('../../app/models/user').User

let listRecord

lab.experiment("users_controller", () => {
  lab.before((done) => {
    cleanUp().then(() => {
      done()
    });
  })


  lab.test("GET /id (endpoint test)")

  lab.test("POST / with empty payload", (done) => {
    var options = {
      method: "POST",
      url: "/users"
    };
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(400)
      server.stop(done)  // done() callback is required to end the test.
    })
  })

  lab.test("POST / with valid payload", (done) => {
    var options = {
      method: "POST",
      url: "/users",
      payload: {
        phone: 9999999999
      }
    };
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(201)
      Code.expect(response.result).to.be.a.object()
      Code.expect(response.result.user).to.be.a.object()
      Code.expect(response.result.user._id).to.not.be.null()
      Code.expect(response.result.user.tempToken).to.not.be.null()
      User.findOne({}, (err, user) => {
        Code.expect(user.verificationCode).to.not.be.undefined()
        server.stop(done)
      })
    })
  })

  lab.test("PUT / update list")

})
