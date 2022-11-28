const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    category:{type: String , required:true},
    data: [{
        title : {type: String},
        content : {type: String},
        cost : {type: Number},
        buys : {type: Number,default:0}
    }]
}, { collection: 'Posts' })

const model = mongoose.model('PostSchema', PostSchema);

module.exports = model;