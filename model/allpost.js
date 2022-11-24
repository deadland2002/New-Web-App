const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    category:{type: String,"default" : "",required:true},
    content: {type: String,"default" : ""},
    cost: {type : Number , "default" : 0 }
}, { collection: 'Posts' })

const model = mongoose.model('PostSchema', PostSchema);

module.exports = model;