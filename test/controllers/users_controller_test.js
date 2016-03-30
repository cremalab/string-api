
'use strict'

const Lab          = require("lab");
const lab          = exports.lab = Lab.script();
const Code         = require("code");
const server       = require("../../server");
const Db           = require("../../database")
const stubList     = require('../testHelpers').stubList
const stubAuthUser = require('../testHelpers').stubAuthUser
const cleanUp      = require('../testHelpers').cleanUp
const authRequest  = require('../testHelpers').authRequest
const User         = require('../../app/models/user').User

let listRecord

lab.experiment("users_controller", () => {
  lab.beforeEach((done) => {
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

  lab.test("PUT / requires auth", (done) => {
    stubAuthUser().then((userRecord) => {
      var options = {
        method: "PUT",
        url: `/users`,
        payload: {
          name: "Justin Timberlake"
        }
      };
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(401)
        server.stop(done)
      })
    })
  })

  lab.test("PUT / with valid payload", (done) => {
    stubAuthUser().then((userRecord) => {
      let options = authRequest({
        method: "PUT",
        url: `/users`,
        payload: {
          name: "Justin Timberlake"
        }
      }, userRecord);
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(200)
        Code.expect(response.result).to.be.a.object()
        Code.expect(response.result.user).to.be.a.object()
        Code.expect(response.result.user.name).to.equal("Justin Timberlake")
        server.stop(done)
      })
    })
  })

})
