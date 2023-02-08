const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        required: true
    },
    order: {
        orderId: { type: String },
        status: { type: String },
        paymentId: { type: String }
    }
});

module.exports = mongoose.model('Users', userSchema);