const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
    hours: {
        type: Number,
        required: true,
        min: 0,
        max: 23,
    },
    minutes: {
        type: Number,
        default: 0,
        min: 0,
        max: 59,
    },
    _id: false, 
});

module.exports = timeSchema;
