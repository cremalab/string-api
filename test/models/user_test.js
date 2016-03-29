'use strict'

const Lab     = require("lab");           // load Lab module
const lab     = exports.lab = Lab.script(); //export test script
const Code    = require("code");      //assertion library
const server  = require("../../server"); // our index.js from above
const User    = require('../../app/models/user').User
const Db      = require("../../database")
const cleanUp = require('../testHelpers').cleanUp

lab.experiment("User", () => {
  lab.beforeEach((done) => {
    cleanUp().then(() => done())
  })

  lab.test.only("User validation", (done) => {
    let options = {
      phone: "9999"
    }
    let user = new User(options)
    user.save((err, user) => {
      console.log(err);
      Code.expect(err).to.not.be.null()
      Code.expect(err.name).to.equal('ValidationError')
      done()
    })
  });

})
