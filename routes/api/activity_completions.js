'use strict'

const keystone = require('keystone')
const Boom     = require('boom')
const ActivityCompletion = keystone.list('ActivityCompletion')
const Activity = keystone.list('Activity')

exports.create = (req, res) => {
  const activityId = request.payload._activity
  Activity.model.findOne({_id: activityId}, (err, activity) => {
    if ( err ) { return res.json(Boom.badRequest(err) ) }
    if ( !activity ) { return res.json(Boom.notFound("Activity not found")) }

    let completion = new ActivityCompletion.model({
      activity: activityId,
      list: activity.list,
      location: activity.location,
      user: request.currentUser()._id,
      description: activity.description
    })
    completion.save((err, completion) => {
      if ( err ) { return res.json(Boom.badRequest(err)) }
      activity.changeCompletedCount(1)
      res.status(201).json({activity_completion: completion})
    })
  })
}

exports.destroy = (req, res) => {
  const id = req.params.activityCompletionId
  ActivityCompletion.model.findOne({_id: id}, (err, completion) => {
    if ( err ) { return res.json(Boom.badRequest(err) ) }
    if ( !completion ) { return res.json(Boom.notFound("Activity Completion not found")) }
    Activity.findOne({_id: completion.activity}, (err, activity) => {
      if (!err && activity) {activity.changeCompletedCount(-1)}
    })
    completion.remove()
    res.json({message: "Activity Completion deleted successfully"})
  })
}
