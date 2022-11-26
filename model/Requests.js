const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    category:{type: String , required:true},
    data: [{
        email : {type: String},
        title : {type: String},
        content : {type: String},
        cost : {type: Number},
    }]
}, { collection: 'Requests' })

const model = mongoose.model('RequestSchema', RequestSchema);

module.exports = model;