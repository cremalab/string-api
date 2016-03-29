'use strict'

const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema,
      Location = require('./location').Location

const ActivitySchema = new Schema({
    description: { type: String, required: true },
    _list:       { type: Schema.Types.ObjectId, required: true, ref: 'list' },
    createdAt:   { type: Date, required: true, default: Date.now },
    completedCount: { type: Number, default: 0 },
    _location:   { type: Schema.Types.ObjectId, ref: 'location' },
    _creator:    { type: Schema.Types.ObjectId, ref: 'user', required: true }
})

ActivitySchema.methods.getLocationData = function() {
  return new Promise((resolve, reject) => {
    return Location.findOne({_id: this._location}).exec((err, location) => {
      if (err) { reject(err) }
      location.getDetails().then((details) => {
        details._id = location._id
        details.id = location.id
        resolve(details)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

ActivitySchema.pre('remove', function(done) {
  const List   = require('./list').List
  List.findOne({_id: this._list}).then((list) => {
    if (list) {list.changeActivityCount(-1)}
  })
  done()
})

ActivitySchema.pre('save', function(done) {
  const List   = Mongoose.model('list')
  if (this.isNew) {
    List.findOne({_id: this._list}).then((list) => {
      if (list) {list.changeActivityCount(1)}
    })
  }
  done()
})

let Activity;
if (Mongoose.models.activity) {
  Activity = Mongoose.model('activity');
} else {
  Activity = Mongoose.model('activity', ActivitySchema);
}
module.exports = {
  Activity: Activity
}
