const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email must be Provided'],
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Name must be Provided'],
        },
        password: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            require: true,
        },
        createdAt: { type: Date, default: Date.now, index: { expires: 300 } },
    },
    { timestamps: true }
);


module.exports = mongoose.model('Otp', otpSchema);