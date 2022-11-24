const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    category:{type: String , required:true},
    data: [{
        title : {type: String},
        content : {type: String},
        cost : {type: Number},
    }]
}, { collection: 'Posts' })

const model = mongoose.model('PostSchema', PostSchema);

module.exports = model;