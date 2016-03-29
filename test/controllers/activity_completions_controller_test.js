'use strict'

const Lab          = require("lab");           // load Lab module
const lab          = exports.lab = Lab.script(); //export test script
const Code         = require("code");      //assertion library
const server       = require("../../server"); // our index.js from above
const Location     = require('../../app/models/location').Location
const Activity     = require('../../app/models/activity').Activity
const Db           = require("../../database")
const cleanUp      = require('../testHelpers').cleanUp
const stubActivity = require('../testHelpers').stubActivity
const stubActivityCompletion = require('../testHelpers').stubActivityCompletion
const stubLocation = require('../testHelpers').stubLocation
const stubAuthUser = require('../testHelpers').stubAuthUser
const authRequest  = require('../testHelpers').authRequest
const stubList     = require('../testHelpers').stubList
// const stubActivityCompletion  = require('./testHelpers').stubActivityCompletion

let listRecord, locationRecord, activityRecord, userRecord, completionRecord;

lab.experiment("activity_completions_controller", () => {
  lab.before((done) => {
    Promise.all([
      cleanUp(),
      stubLocation(),
      stubAuthUser()
    ]).then((values) => {
      locationRecord = values[1]
      userRecord     = values[2]
      Promise.all([stubList(userRecord), stubActivity(userRecord)]).then((values) => {
        listRecord     = values[0]
        activityRecord = values[1]
        stubActivityCompletion(activityRecord, userRecord).then((completion) => {
          completionRecord = completion
          done()
        })
      })
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


  lab.test("POST /", (done) => {
    let act = new Activity({
      _creator: userRecord._id,
      _list: listRecord._id,
      _location: locationRecord,
      description: "Did the hokey-pokey"
    })

    act.save((err, activity) => {
      var options = authRequest({
        method: "POST",
        url: "/activity_completions",
        payload: {
          _activity: activity._id
        }
      }, userRecord)
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(201)
        Code.expect(response.result).to.be.a.object()
        Code.expect(response.result.activity_completion).to.be.a.object()
        Code.expect(response.result.activity_completion._id).to.not.be.undefined()
        server.stop(done)
      })
    })
  })

  lab.test("POST / duplicate", (done) => {
    console.log(completionRecord._activity);
    var options = authRequest({
      method: "POST",
      url: "/activity_completions",
      payload: {
        _activity: completionRecord._activity
      }
    }, userRecord)
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(400)
      Code.expect(response.result).to.be.a.object()
      Code.expect(response.result.activity_completion).to.be.undefined()
      server.stop(done)
    })
  })

  lab.test("DELETE /{id}", (done) => {
    var options = authRequest({
      method: "DELETE",
      url: `/activity_completions/${completionRecord._id}`
    }, userRecord)
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(200)
      Code.expect(response.result).to.be.a.object()
      server.stop(done)
    })
  })

})
