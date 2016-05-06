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
    .end( (err, res) => {
      t.notOk(err);
      t.is(res.statusCode, 200);
      t.is(typeof res.body.activity, 'object')
      t.is(typeof res.body.activity.location, 'object' )
      t.end()
    })
});

test.cb.only('create with empty payload', t => {
  request(app)
    .post(`/api/activities`)
    .set({"Authorization": userRecord.generateAuthToken() })
    .send({})
    // .set("Authorization", userRecord.generateAuthToken())
    .end( (err, res) => {
      t.notOk(err);
      t.is(res.statusCode, 422);
      t.end()
    })
})
