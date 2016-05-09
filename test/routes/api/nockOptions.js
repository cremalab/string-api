const nock      = require('nock');
const Path      = require('path')
const responses = require('./responses/gmaps.js')

nock('https://maps.googleapis.com')
  .get('/maps/api/place/details/json')
  .query({"placeid":"ChIJ99ro0TzvwIcRZ4gy5tGQ_4o","key":"AIzaSyA2_sxjDvYn92zZn9y0vqM6hdGXIS6aapA"})
  .reply(200, responses.details);
