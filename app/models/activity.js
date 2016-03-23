const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const ActivitySchema = new Schema({
    activityId:  { type: Schema.Types.ObjectId, unique: true, required: true },
    description: { type: String, required: true },
    listId:      { type: Schema.Types.ObjectId, required: true },
    createdAt:   { type: Date, required: true, default: Date.now },
    completedCount: { type: Number, default: 0 },
    locationId:  { type: Schema.Types.ObjectId }
})

const activity = Mongoose.model('activity', ActivitySchema)

module.exports = {
    Activity: activity
}
