const ListsController      = require('./app/controllers/lists_controller');
const ActivitiesController = require('./app/controllers/activities_controller');

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
  { method: 'DELETE', path: '/activities/{activityId}', config: ActivitiesController.remove}
];
