'use strict'

const Lab              = require("lab");
const List             = require('../../app/models/list').List
const Activity         = require('../../app/models/activity').Activity
const lab              = exports.lab = Lab.script();
const Code             = require("code");
const server           = require("../../server");
const Db               = require("../../database")
const removeActivities = require('./testHelpers').removeActivities
const cleanUp          = require('./testHelpers').cleanUp
const stubList         = require('./testHelpers').stubList
const stubLocation     = require('./testHelpers').stubLocation
const stubActivity     = require('./testHelpers').stubActivity
const stubAuthUser     = require('./testHelpers').stubAuthUser
const authRequest      = require('./testHelpers').authRequest

let listRecord, locationRecord, activityRecord, userRecord;

lab.experiment("activities_controller", () => {
  lab.before((done) => {
    Promise.all([
      cleanUp(),
      stubList(),
      stubLocation(),
      stubActivity(),
      stubAuthUser()
    ]).then((values) => {
      listRecord = values[1]
      locationRecord = values[2]
      activityRecord = values[3]
      userRecord = values[4]
      done()
    })
  })

  lab.test("GET / (endpoint test)", (done) => {
    var options = authRequest({
      method: "GET",
      url: "/activities"
    }, userRecord);
    // server.inject lets you similate an http request
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
      Code.expect(response.result.activities).to.be.a.array();
      server.stop(done);  // done() callback is required to end the test.
    });
  });

  lab.test("GET /id (endpoint test)", (done) => {
    var options = authRequest({
      method: "GET",
      url: `/activities/${activityRecord._id}`
    }, userRecord);
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
      Code.expect(response.result).to.be.a.object();
      Code.expect(response.result.activity).to.be.a.object();
      Code.expect(response.result.activity.location).to.be.a.object();
      server.stop(done);  // done() callback is required to end the test.
    });
  });

  lab.test("POST / with empty payload", (done) => {
    var options = authRequest({
      method: "POST",
      url: "/activities"
    }, userRecord);
    // server.inject lets you similate an http request
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(400)  //  Expect http response status code to be 200 ("Ok")
      server.stop(done)  // done() callback is required to end the test.
    })
  })

  lab.test("POST / with valid payload", (done) => {
    var options = authRequest({
      method: "POST",
      url: "/activities",
      payload: {
        description: "#cheap #drinks in #midtown",
        _list: listRecord._id,
        _location: locationRecord._id
      }
    }, userRecord);
    // server.inject lets you similate an http request
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(201)  //  Expect http response status code to be 200 ("Ok")
      Code.expect(response.result).to.be.a.object()
      Code.expect(response.result.activity).to.be.a.object()
      Code.expect(response.result.activity.description).to.not.be.null()
      Code.expect(response.result.activity._id).to.not.be.null()
      server.stop(done)  // done() callback is required to end the test.
    })
  })

  lab.test("PUT / update activity", (done) => {
    // server.inject lets you similate an http request
    List.findOne({}, (err, list) => {
      var options = authRequest({
        method: "PUT",
        url: `/activities/${activityRecord.id}`,
        payload: {
          description: "Ate 10 tacos"
        }
      }, userRecord);
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(200)  //  Expect http response status code to be 200 ("Ok")
        Code.expect(response.result).to.be.a.object()
        Code.expect(response.result.activity).to.be.a.object()
        Code.expect(response.result.activity.description).to.not.be.null()
        Code.expect(response.result.activity.description).to.equal('Ate 10 tacos')
        Code.expect(response.result.activity._id).to.not.be.null()
        server.stop(done)  // done() callback is required to end the test.
      })
    })
  })

  lab.test("DELETE / delete activity", (done) => {

    var options = authRequest({
      method: "DELETE",
      url: `/activities/${activityRecord.id}`
    }, userRecord);
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(200)
      // expect no activity with the ID of the old record
      Activity.findOne({id: activityRecord.id}, (err, activity) => {
        if (!activity) {server.stop(done)}
      })
    })
  })

})
