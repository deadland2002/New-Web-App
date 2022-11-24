const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type:Number }
}, { collection: 'Otp' })

const model = mongoose.model('OtpSchema', OtpSchema);

module.exports = model;