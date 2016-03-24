'use strict'

const Lab           = require("lab");           // load Lab module
const lab           = exports.lab = Lab.script(); //export test script
const Code          = require("code");      //assertion library
const server        = require("../../server"); // our index.js from above
const Location      = require('../../app/models/location').Location
const Db            = require("../../database")
const cleanUp       = require('./testHelpers').cleanUp
const stubLocation  = require('./testHelpers').stubLocation

let locationRec;

lab.experiment("locations_controller", () => {
  lab.before((done) => {
    Promise.all([
      cleanUp(),
      stubLocation()
    ]).then((values) => {
      locationRec = values[1]
      done()
    })
  })

  // tests
  lab.test("GET / (endpoint test)", (done) => {
    var options = {
      method: "GET",
      url: "/locations"
    };
    // server.inject lets you similate an http request
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
      Code.expect(response.result).to.be.a.array();
      server.stop(done);  // done() callback is required to end the test.
    });
  });

  lab.test("GET /id (endpoint test)", (done) => {
    var options = {
      method: "GET",
      url: `/locations/${locationRec.id}`
    }
    // server.inject lets you similate an http request
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(200)  //  Expect http response status code to be 200 ("Ok")
      Code.expect(response.result).to.be.a.object()
      Code.expect(response.result._id).to.contain(locationRec._id)
      Code.expect(response.result.name).to.not.be.undefined()
      server.stop(done);  // done() callback is required to end the test.
    });
  });

  lab.test("POST / google-places id", (done) => {
    var options = {
      method: "POST",
      url: "/locations",
      payload: {
        placeId: "ChIJ99ro0TzvwIcRZ4gy5tGQ_4o" // Burger King!
      }
    };
    // server.inject lets you similate an http request
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(201)  //  Expect http response status code to be 200 ("Ok")
      Code.expect(response.result).to.be.a.object()
      Code.expect(response.result.id).to.not.be.undefined()
      Code.expect(response.result.name).to.not.be.undefined()
      Code.expect(response.result.place_id).to.not.be.undefined()
      server.stop(done)  // done() callback is required to end the test.
    })
  })

})
