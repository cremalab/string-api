'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const ActivityList = keystone.list('ActivityList')

exports.index = (req, res) => {
  ActivityList.paginate({
    page: req.query.page || 1,
    perPage: 20,
    maxPages: 10
  }).where({
    isKept: true,
    isPublished: true
  }).populate('creator').sort('-createdAt')
  .exec((err, data) => {
    if (!err) {
      return res.status(200).json({
        activity_lists: data.results,
        pagination: {
          next: data.next,
          last: data.last,
          total: data.total,
          totalPages: data.totalPages,
          currentPage: data.currentPage
        }
      })
    } else {
      return res.status(400).json(Boom.badImplementation(err))
    }
  })
}

exports.mine = (req, res) => {
  ActivityList.paginate({
    page: req.query.page || 1,
    perPage: 20,
    maxPages: 10
  }).where({creator: req.currentUser._id})
  .populate('creator').sort('-createdAt')
  .exec((err, data) => {
    if (!err) {
      return res.status(200).json({
        activity_lists: data.results,
        pagination: {
          next: data.next,
          last: data.last,
          total: data.total,
          totalPages: data.totalPages,
          currentPage: data.currentPage
        }
      })
    } else {
      return res.status(400).json(Boom.badImplementation(err))
    }
  })
}

exports.show = (req, res) => {
  ActivityList.model.findOne({'_id': req.params.listId})
  .populate('creator')
  .exec((err, list) => {
    if (err) { return res.status(422).json(Boom.notFound(err)) }
    if (!list) { return res.status(404).json(Boom.notFound()) }
    Promise.all([
      list.collectActivities(),
      list.collectCompletions(req.currentUser)
    ]).then((values) => {
      const activities  = values[0]
      const completions = values[1]
      let listJSON      = list.toObject()
      listJSON.activities    = activities
      return res.status(200).json({activity_list: listJSON, userCompletions: completions })
    }).catch((err) => {
      res.status(422).json(Boom.badImplementation(err))
    })
  })
}

exports.create = (req, res) => {
  var list = new ActivityList.model(req.body)
  list.creator = req.currentUser._id
  return list.save().then(() => {
    return res.status(201).json({activity_list: list.toObject()})
  }).catch((err) => {
    if (11000 === err.code || 11001 === err.code) {
      res.status(422).json(Boom.forbidden('please provide another list id, it already exist'))
    } else res.status(422).json(Boom.forbidden(err)) // HTTP 403
  })
}

exports.update = (req, res) => {
  ActivityList.model.findOne({
    '_id': req.params.listId,
    'creator': req.currentUser._id
  }, function(err, list) {
    if (err) {
      res.status(422).json(Boom.badImplementation(err))
    } else {
      list = Object.assign(list, req.body)
      if (list.isPublished && !list.isKept) {list.isKept = true}
      list.save(function(err, list) {
        if (!err) {
          res.status(200).json({activity_list: list.toObject()})
        } else {
          res.status(422).json(Boom.badImplementation(err))
        }
      })
    }
  })
}

exports.destroy = (req, res) => {
  ActivityList.model.findOne({
    '_id': req.params.listId,
    'creator': req.currentUser._id
  }, function(err, list) {
    if (!err && list) {
      list.remove()
      res.status(200).json({
        message: 'List deleted successfully'
      })
    } else if (!err) {
      // Couldn't find the object.
      res.status(404).json(Boom.notFound())
    } else {
      res.status(422).json(Boom.badRequest('Could not delete List'))
    }
  })
}
