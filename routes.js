const ListsController = require('./app/controllers/lists_controller');

exports.endpoints = [
  { method: 'GET',    path: '/lists', config: ListsController.getAll },
  { method: 'POST',   path: '/lists', config: ListsController.create },
  { method: 'GET',    path: '/lists/{listId}', config: ListsController.getOne },
  { method: 'PUT',    path: '/lists/{listId}', config: ListsController.update },
  { method: 'DELETE', path: '/lists/{listId}', config: ListsController.remove}
  // { method: 'POST', path: '/user', config:  Controller.create},
  // { method: 'GET', path: '/user', config:   Controller.getAll},
  // { method: 'GET', path: '/user/{userId}', config: Controller.getOne},
  // { method: 'PUT', path: '/user/{userId}', config: Controller.update},
];
