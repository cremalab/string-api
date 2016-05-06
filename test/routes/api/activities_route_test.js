import test from 'ava';
import request from 'supertest';
import {keystone, cleanUp, stubLocation, stubAuthUser, stubList, stubActivity} from '../../testHelpers'

const app = keystone.app;

let listRecord, locationRecord, activityRecord, userRecord;

test.beforeEach(async t => {
  await Promise.all([
    cleanUp(),
    stubLocation(),
    stubAuthUser()
  ]).then((values) => {
    locationRecord = values[1]
    userRecord     = values[2]
    return Promise.all([stubList(userRecord), stubActivity(userRecord)]).then((values) => {
      listRecord     = values[0]
      activityRecord = values[1]
    })
  })
});

test.cb('index', t => {
  request(app)
    .get("/api/activities")
    .set({"Authorization": userRecord.generateAuthToken() })
    .end( (err, res) => {
      t.notOk(err);
      t.is(res.statusCode, 200);
      t.true(Array.isArray(res.body.activities))
      t.end();
    })
});

test.cb('show', t => {
  request(app)
    .get(`/api/activities/${activityRecord._id}`)
    .set({"Authorization": userRecord.generateAuthToken() })
    .end( (err, res) => {
      t.notOk(err);
      t.is(res.statusCode, 200);
      t.is(typeof res.body.activity, 'object')
      t.is(typeof res.body.activity.location, 'object' )
      t.end()
    })
});

test.cb('create with empty payload', t => {
  request(app)
    .post(`/api/activities`)
    .set({"Authorization": userRecord.generateAuthToken() })
    .send({})
    .end( (err, res) => {
      t.notOk(err);
      t.is(res.statusCode, 422);
      t.end()
    })
})

test.cb('create with valid payload', t => {
  request(app)
    .post(`/api/activities`)
    .set({"Authorization": userRecord.generateAuthToken() })
    .send({
      description: "Ate 10 tacos",
      activity_list: listRecord._id,
      location: locationRecord._id
    })
    .end( (err, res) => {
      t.notOk(err);
      t.is(res.statusCode, 201);
      t.is(typeof res.body.activity, 'object')
      t.not(res.body.activity._id, undefined)
      t.end()
    })
})

test.cb('update', t => {
  request(app)
    .put(`/api/activities/${activityRecord._id}`)
    .set({"Authorization": userRecord.generateAuthToken() })
    .send({
      description: "Ate 500 tacos"
    })
    .end( (err, res) => {
      t.notOk(err);
      t.is(res.statusCode, 200);
      t.is(typeof res.body.activity, 'object')
      t.is(res.body.activity.description, "Ate 500 tacos")
      t.end()
    })
})

test.cb('update', t => {
  request(app)
    .delete(`/api/activities/${activityRecord._id}`)
    .set({"Authorization": userRecord.generateAuthToken() })
    .end( (err, res) => {
      t.notOk(err);
      t.is(res.statusCode, 200);
      keystone.list('Activity').model.findOne({id: activityRecord.id}, (err, activity) => {
        if (activity) { t.fail() }
        if (!activity) {t.end()}
      })
    })
})
