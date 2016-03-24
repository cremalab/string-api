const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const ActivitySchema = new Schema({
    description: { type: String, required: true },
    _list:       { type: Schema.Types.ObjectId, required: true, ref: 'list' },
    createdAt:   { type: Date, required: true, default: Date.now },
    completedCount: { type: Number, default: 0 },
    _location:   { type: Schema.Types.ObjectId, ref: 'location' }
})

const activity = Mongoose.model('activity', ActivitySchema)

module.exports = {
    Activity: activity
}
