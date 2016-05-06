// import test from 'ava';
// import request from 'supertest';
// import {cleanUp, stubLocation, stubAuthUser} from '../../testHelpers'
// import keystone from '../../keystoneTestHelper';
//
// const app = keystone.app;
//
// let listRecord, locationRecord, activityRecord, userRecord;
//
// test.beforeEach(async t => {
//   await cleanUp()
// });
//
// test.cb('create with empty payoad', t => {
//   request(app)
//     .post("/api/users")
//     .send({})
//     .end( (err, res) => {
//       t.is(res.statusCode, 400);
//       t.end()
//     })
// });
//
// test.cb('create with valid payload', t => {
//   request(app)
//     .post("/api/users")
//     .send({
//       phone: 9999999999
//     })
//     .end( (err, res) => {
//       t.is(res.statusCode, 201);
//       t.is(typeof res.body.user, 'object');
//       t.not(typeof res.body.user._id, 'undefined');
//       t.not(typeof res.body.user.tempToken, null)
//       keystone.list('User').model.findOne({}, (err, user) => {
//         t.not(user.verificationCode, null)
//         t.end()
//       })
//     })
// });
//
// test.cb('put requires auth', t => {
//   stubAuthUser().then((userRecord) => {
//     request(app)
//       .put(`/api/users`)
//       .send({
//         name: "Boaty McBoatface"
//       })
//       .end( (err, res) => {
//         t.is(res.statusCode, 401);
//         t.end()
//       })
//     })
// });
//
// test.cb('put with vlid payload', t => {
//   stubAuthUser().then((userRecord) => {
//     request(app)
//       .put(`/api/users`)
//       .set({"Authorization": userRecord.generateAuthToken() })
//       .send({
//         name: "Boaty McBoatface"
//       })
//       .end( (err, res) => {
//         t.is(res.statusCode, 200);
//         t.is(res.body.user.name, "Boaty McBoatface")
//         t.end()
//       })
//     })
// });
