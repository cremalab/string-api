'use strict'

const Lab           = require("lab");           // load Lab module
const lab           = exports.lab = Lab.script(); //export test script
const Code          = require("code");      //assertion library
const server        = require("../../server"); // our index.js from above
const Location      = require('../../app/models/location').Location
const Db            = require("../../database")
const cleanUp       = require('./testHelpers').cleanUp
const stubActivity  = require('./testHelpers').stubActivity
// const stubActivityCompletion  = require('./testHelpers').stubActivityCompletion

let activityRec, activityCompRec;

lab.experiment("activity_completions_controller", () => {
  lab.before((done) => {
    Promise.all([
      cleanUp(),
      stubActivity(),
    ]).then((values) => {
      activityRec = values[1]
      // stubActivityCompletion(activityRec)
      done()
    })
  })

  // tests
  lab.test("GET / (endpoint test)") //, (done) => {
  //   var options = {
  //     method: "GET",
  //     url: "/locations"
  //   };
  //   // server.inject lets you similate an http request
  //   server.inject(options, (response) => {
  //     Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
  //     Code.expect(response.result.locations).to.be.a.array();
  //     server.stop(done);  // done() callback is required to end the test.
  //   });
  // });


  lab.test.only("POST /", (done) => {
    var options = {
      method: "POST",
      url: "/activity_completions",
      payload: {
        _activity: activityRec._id
      }
    }
    // server.inject lets you similate an http request
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(201)  //  Expect http response status code to be 200 ("Ok")
      Code.expect(response.result).to.be.a.object()
      Code.expect(response.result.activity_completion).to.be.a.object()
      Code.expect(response.result.activity_completion._id).to.not.be.undefined()
      server.stop(done)  // done() callback is required to end the test.
    })
  })

  // lab.test.only("DELETE /{id}", (done) => {
  //   var options = {
  //     method: "DELETE",
  //     url: "/activity_completions/activityCompRec",
  //     payload: {
  //       _activity: activityRec._id
  //     }
  //   }
  //   // server.inject lets you similate an http request
  //   server.inject(options, (response) => {
  //     Code.expect(response.statusCode).to.equal(201)  //  Expect http response status code to be 200 ("Ok")
  //     Code.expect(response.result).to.be.a.object()
  //     Code.expect(response.result.activity_completion).to.be.a.object()
  //     Code.expect(response.result.activity_completion._id).to.not.be.undefined()
  //     server.stop(done)  // done() callback is required to end the test.
  //   })
  // })

})
