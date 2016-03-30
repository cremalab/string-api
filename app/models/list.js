'use strict'

const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema,
      Activity = require('./activity').Activity,
      ActivityCompletion = require('./activity_completion').ActivityCompletion

const ListSchema = new Schema({
    description: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    activityCount: { type: Number, default: 0 },
    _creator: { type: Schema.Types.ObjectId, ref: 'user', required: true},
    published: { type: Boolean, default: false }
})
// ListSchema.plugin(deepPopulate);
ListSchema.methods.collectActivities = function() {
  return new Promise((resolve, reject) => {
    return Activity.find({_list: this._id}).exec((err, activities) => {
      if (err) { reject(err) }
      let dataLookups = activities.map((activity) => activity.getLocationData())
      Promise.all(dataLookups)
        .then((locations) => {
          resolve(activities.map((activity, i) => {
            activity = Object.assign({}, activity.toJSON())
            activity.location = locations[i]
            return activity
          }))
        })
        .catch((err) => reject(err))
    })
  })
}

ListSchema.methods.collectCompletions = function(user) {
  return new Promise((resolve, reject) => {
    return ActivityCompletion.find({_list: this._id, _user: user._id})
    .exec((err, completions) => {
      if (err) { reject(err) }
      return resolve(completions)
    })
  })
}

ListSchema.methods.changeActivityCount = function(inc) {
  this.activityCount+=inc
  return this.save()
}

let List;
if (Mongoose.models.list) {
  List = Mongoose.model('list');
} else {
  List = Mongoose.model('list', ListSchema);
}
module.exports = {
  List: List
}
