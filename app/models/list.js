const Mongoose = require('mongoose'),
      Schema = Mongoose.Schema

const ListSchema = new Schema({
    listId: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now }
})

const list = Mongoose.model('list', ListSchema)

module.exports = {
    List: list
}
