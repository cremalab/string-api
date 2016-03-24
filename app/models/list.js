const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const ListSchema = new Schema({
    description: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    activities: [{ type: Schema.Types.ObjectId, ref: 'activity' }]
})

const list = Mongoose.model('list', ListSchema)

module.exports = {
    List: list
}
