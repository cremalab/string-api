const ListsController      = require('./app/controllers/lists_controller');
const ActivitiesController = require('./app/controllers/activities_controller');
const LocationsController  = require('./app/controllers/locations_controller');
const LocationsSearchController  = require('./app/controllers/locations_search_controller');

exports.endpoints = [
  { method: 'GET',    path: '/lists', config: ListsController.getAll },
  { method: 'POST',   path: '/lists', config: ListsController.create },
  { method: 'GET',    path: '/lists/{listId}', config: ListsController.getOne },
  { method: 'PUT',    path: '/lists/{listId}', config: ListsController.update },
  { method: 'DELETE', path: '/lists/{listId}', config: ListsController.remove},

  { method: 'GET',    path: '/activities', config: ActivitiesController.getAll },
  { method: 'POST',   path: '/activities', config: ActivitiesController.create },
  { method: 'GET',    path: '/activities/{activityId}', config: ActivitiesController.getOne },
  { method: 'PUT',    path: '/activities/{activityId}', config: ActivitiesController.update },
  { method: 'DELETE', path: '/activities/{activityId}', config: ActivitiesController.remove},

  { method: 'GET', path: '/locations_search/{search?}', config: LocationsSearchController.getPredictions },

  { method: 'GET',    path: '/locations', config: LocationsController.getAll },
  { method: 'GET',    path: '/locations/{locationId}', config: LocationsController.getOne },
  { method: 'POST',   path: '/locations', config: LocationsController.create },
  // { method: 'GET',    path: '/locations/{locationId}', config: LocationsController.getOne },
  // { method: 'PUT',    path: '/locations/{locationId}', config: LocationsController.update },
  // { method: 'DELETE', path: '/locations/{locationId}', config: LocationsController.remove}


];
