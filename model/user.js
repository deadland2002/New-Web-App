const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true },
    coins: { type: Number, "default": 0 },
    refers: { type: Number, "default": 0 },
    subs: [
        {
            category : { type: String},
            id : { type: String}
        }
    ]
}, { collection: 'users' })

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;