'use strict'

const Lab    = require("lab");           // load Lab module
const List   = require('../../app/models/list').List
const lab    = exports.lab = Lab.script(); //export test script
const Code   = require("code");      //assertion library
const server = require("../../server"); // our index.js from above
const Db     = require("../../database")


lab.experiment("lists_controller", () => {
  lab.before((done) => {
    List.remove({})
    let list = new List({description: '#art #walk in the #crossroads'});
    list.save((err, list) => done())
  })

  // tests
  lab.test("GET / (endpoint test)", (done) => {
    var options = {
      method: "GET",
      url: "/lists"
    };
    // server.inject lets you similate an http request
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
      Code.expect(response.result).to.be.a.array();
      server.stop(done);  // done() callback is required to end the test.
    });
  });

  lab.test("POST / with empty payload", (done) => {
    var options = {
      method: "POST",
      url: "/lists"
    };
    // server.inject lets you similate an http request
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(400)  //  Expect http response status code to be 200 ("Ok")
      server.stop(done)  // done() callback is required to end the test.
    })
  })

  lab.test("POST / with valid payload", (done) => {
    var options = {
      method: "POST",
      url: "/lists",
      payload: {
        description: "#cheap #drinks in #midtown"
      }
    };
    // server.inject lets you similate an http request
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(201)  //  Expect http response status code to be 200 ("Ok")
      Code.expect(response.result).to.be.a.object()
      Code.expect(response.result.description).to.not.be.null()
      Code.expect(response.result._id).to.not.be.null()
      server.stop(done)  // done() callback is required to end the test.
    })
  })

  lab.test("PUT / update list", (done) => {
    // server.inject lets you similate an http request
    List.findOne({}, (err, list) => {
      var options = {
        method: "PUT",
        url: `/lists/${list._id}`,
        payload: {
          description: "#cheap #drinks in #midtown"
        }
      };
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(200)  //  Expect http response status code to be 200 ("Ok")
        Code.expect(response.result).to.be.a.object()
        Code.expect(response.result.description).to.not.be.null()
        Code.expect(response.result._id).to.not.be.null()
        server.stop(done)  // done() callback is required to end the test.
      })
    })
  })

  lab.test("DELETE / delete list", (done) => {
    // server.inject lets you similate an http request
    List.findOne({}, (err, list) => {
      var options = {
        method: "DELETE",
        url: `/lists/${list._id}`
      };
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(200)  //  Expect http response status code to be 200 ("Ok")
        Code.expect(response.result).to.be.a.object()
        Code.expect(response.result.description).to.not.be.null()
        Code.expect(response.result._id).to.not.be.null()
        server.stop(done)  // done() callback is required to end the test.
      })
    })
  })

})
