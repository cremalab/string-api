'use strict'

const keystone = require('keystone');
const Types = keystone.Field.Types;
const Activity = new keystone.List('Activity');
// const Location = keystone.list('Location')
// const ActivityList = keystone.List('ActivityList')

Activity.add({
  description: { type: Types.Textarea, required: true, initial: true },
  activity_list: { type: Types.Relationship, ref: 'ActivityList', required: true, initial: true },
  location: { type: Types.Relationship, ref: 'Location' },
  creator: { type: Types.Relationship, ref: 'User', required: true, initial: true },
  createdAt:   { type: Types.Datetime, required: true, default: Date.now },
  completedCount: { type: Number, default: 0 },
})

Activity.schema.methods.changeCompletedCount = function(inc) {
  this.completedCount+=inc
  return this.save()
}

// Activity.schema.pre('remove', function(done) {
//   ActivityList.model.findOne({_id: this._list}).then((list) => {
//     if (list) {list.changeActivityCount(-1)}
//   })
//   done()
// })
//
// Activity.schema.pre('save', function(done) {
//   if (this.isNew) {
//     ActivityList.model.findOne({_id: this._list}).then((list) => {
//       if (list) {list.changeActivityCount(1)}
//     })
//   }
//   done()
// })


Activity.register()
module.exports = Activity
