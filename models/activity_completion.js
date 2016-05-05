'use strict'

const keystone = require('keystone');
const Types = keystone.Field.Types;
const ActivityCompletion = new keystone.List('ActivityCompletion');

ActivityCompletion.add({
  activity:      { type: Types.Relationship, ref: 'Activity', required: true, initial: true },
  user:          { type: Types.Relationship, ref: 'User', required: true, initial: true },
  activity_list: { type: Types.Relationship, ref: 'ActivityList', required: true, initial: true },
  location:      { type: Types.Relationship, ref: 'Location'},
  createdAt:     { type: Date, required: true, default: Date.now },
  description:   { type: String, required: true, initial: true }
})

ActivityCompletion.schema.pre("save", function(next) {
  ActivityCompletion.findOne({
    _user : this._user, _activity: this._activity
  }, '_activity', (err, results) => {
    if(err) {
      next(err);
    } else if(results) {
      this.invalidate("_activity", "You have already completed this activity");
      next(new Error("You have already completed this activity"));
    } else {
      next();
    }
  });
});

ActivityCompletion.register()
module.exports = ActivityCompletion
