'use strict'

const Lab          = require("lab");
const List         = require('../../app/models/list').List
const lab          = exports.lab = Lab.script();
const Code         = require("code");
const server       = require("../../server");
const Db           = require("../../database")
const stubList     = require('./testHelpers').stubList
const stubAuthUser = require('./testHelpers').stubAuthUser
const cleanUp      = require('./testHelpers').cleanUp
const authRequest  = require('./testHelpers').authRequest

let listRecord, userRecord

lab.experiment("lists_controller", () => {
  lab.before((done) => {
    Promise.all([cleanUp(), stubAuthUser()]).then((values) => {
      userRecord = values[1]
      stubList(userRecord).then((list) => {
        listRecord = list
        done()
      })
    })
  })

  lab.test("GET / unauthorized", (done) => {
    var options = {
      method: "GET",
      url: "/lists"
    }

    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(401)
      server.stop(done)
    })
  });

  lab.test("GET / (endpoint test)", (done) => {
    var options = authRequest({
      method: "GET",
      url: "/lists"
    }, userRecord);

    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.be.a.object();
      Code.expect(response.result.lists).to.be.a.array();
      server.stop(done);
    });
  });

  lab.test("GET /id (endpoint test)", {timeout: 10000}, (done) => {
    var options = authRequest({
      method: "GET",
      url: `/lists/${listRecord.id}`
    }, userRecord)
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.result).to.be.a.object();
      Code.expect(response.result.list).to.be.a.object();
      Code.expect(response.result.list.activities).to.be.a.array();
      Code.expect(response.result.list.activities[0].location).to.be.a.object();
      console.log(response.result);
      Code.expect(response.result.userCompletions).to.be.a.array();
      server.stop(done);
    });
  });

  lab.test("POST / with empty payload", (done) => {
    var options = authRequest({
      method: "POST",
      url: "/lists"
    }, userRecord)
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(400)
      server.stop(done)
    })
  })

  lab.test("POST / with valid payload", (done) => {
    var options = authRequest({
      method: "POST",
      url: "/lists",
      payload: {
        description: "#cheap #drinks in #midtown"
      }
    }, userRecord)
    server.inject(options, (response) => {
      Code.expect(response.statusCode).to.equal(201)
      Code.expect(response.result).to.be.a.object()
      Code.expect(response.result.list).to.be.a.object()
      Code.expect(response.result.list.description).to.not.be.null()
      Code.expect(response.result.list._id).to.not.be.null()
      server.stop(done)
    })
  })

  lab.test("PUT / update list", (done) => {
    List.findOne({}, (err, list) => {
      var options = authRequest({
        method: "PUT",
        url: `/lists/${list._id}`,
        payload: {
          description: "#cheap #drinks in #midtown"
        }
      }, userRecord)
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(200)
        Code.expect(response.result).to.be.a.object()
        Code.expect(response.result.list).to.be.a.object()
        Code.expect(response.result.list.description).to.not.be.null()
        Code.expect(response.result.list._id).to.not.be.null()
        server.stop(done)
      })
    })
  })

  lab.test("DELETE / delete list", (done) => {
    List.findOne({}, (err, list) => {
      var options = authRequest({
        method: "DELETE",
        url: `/lists/${list._id}`
      }, userRecord)
      server.inject(options, (response) => {
        Code.expect(response.statusCode).to.equal(200)
        Code.expect(response.result).to.be.a.object()
        server.stop(done)
      })
    })
  })

})
