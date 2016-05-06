/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

const keystone = require('keystone');
const middleware = require('./middleware');
const importRoutes = keystone.importer(__dirname);
const apiMiddleware = require('./api/middleware')

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function(app) {

	// Views
	app.get('/', routes.views.index);

	// API
	app.all('/api*', apiMiddleware.checkAPIKey);
	app.post('/api/sessions', keystone.middleware.api, routes.api.sessions.create)

	app.post('/api/users', keystone.middleware.api, routes.api.users.create)
	app.put('/api/users', keystone.middleware.api, routes.api.users.update)

	app.get('/api/lists', keystone.middleware.api, routes.api.lists.index);
	app.post('/api/lists', keystone.middleware.api, routes.api.lists.create);
	app.get('/api/lists/:listId', keystone.middleware.api, routes.api.lists.show);
	app.put('/api/lists/:listId', keystone.middleware.api, routes.api.lists.update);
	app.delete('/api/lists/:listId', keystone.middleware.api, routes.api.lists.destroy);

	app.get('/api/activities', keystone.middleware.api, routes.api.activities.index);
	app.post('/api/activities', keystone.middleware.api, routes.api.activities.create);
	app.get('/api/activities/:activityId', keystone.middleware.api, routes.api.activities.show);
	app.put('/api/activities/:activityId', keystone.middleware.api, routes.api.activities.update);
	app.delete('/api/activities/:activityId', keystone.middleware.api, routes.api.activities.destroy);

	app.get('/api/locations_search/:search', keystone.middleware.api, routes.api.locations.search);

	app.get('/api/locations', keystone.middleware.api, routes.api.locations.index);
	app.post('/api/locations', keystone.middleware.api, routes.api.locations.create);
	app.get('/api/locations/:locationId', keystone.middleware.api, routes.api.locations.show);

	app.post('/api/activity_completions', keystone.middleware.api, routes.api.activity_completions.create);
	app.delete('/api/activity_completions/:activityCompletionId', keystone.middleware.api, routes.api.activity_completions.destroy);


	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
