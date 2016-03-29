'use strict'

const Lab            = require("lab");
const lab            = exports.lab = Lab.script()
const Code           = require("code")
const server         = require("../../server")
const Db             = require("../../database")
const stubUnauthUser = require('../testHelpers').stubUnauthUser
const cleanUp        = require('../testHelpers').cleanUp
const User           = require('../../app/models/user').User

let unauthUserRecord

lab.experiment("users_controller", () => {
  lab.before((done) => {
    Promise.all([cleanUp(), stubUnauthUser()]).then((values) => {
      unauthUserRecord = values[1]
      done()
    });
  })

  lab.test("POST / with empty payload", (done) => {
    var options = {
      method: "POST",
      url: "/sessions"
    };
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(400)
      server.stop(done)
    })
  })

  lab.test("POST / with invalid verificationCode", (done) => {
    var options = {
      method: "POST",
      url: "/sessions",
      payload: {
        tempToken: unauthUserRecord.tempToken,
        verificationCode: 88888
      }
    };
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(403)
      server.stop(done)
    })
  })

  lab.test("POST / with valid payload", (done) => {
    var options = {
      method: "POST",
      url: "/sessions",
      payload: {
        tempToken: unauthUserRecord.tempToken,
        verificationCode: unauthUserRecord.verificationCode
      }
    };
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(201)
      Code.expect(response.result).to.be.a.object()
      Code.expect(response.result.user.authToken).to.not.be.undefined();
      Code.expect(response.result.user.id).to.not.be.undefined();
      Code.expect(response.result.user.name).to.not.be.null();
      server.stop(done)
    })
  })
})
