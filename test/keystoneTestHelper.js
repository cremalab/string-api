'use strict'

const keystone = require('../keystone.js');

const port = process.env.TEST_PORT || 5150;
keystone.set('port', port);
keystone.set('mongo','mongodb://localhost/string_api_test');
keystone.start()
module.exports = keystone;
