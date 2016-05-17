'use strict'

const keystoneApp  = require('./keystone.js')
const swaggerTools = require('swagger-tools');
const swaggerDoc   = require('./swagger.json');

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  keystoneApp.app.use(middleware.swaggerMetadata());

  // Serve the Swagger documents and Swagger UI
  keystoneApp.app.use(middleware.swaggerUi());

  // Start the server
  keystoneApp.start()
});
