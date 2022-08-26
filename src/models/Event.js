const mongoose = require('mongoose');
const timeSchema = require('./Time');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Name must be Provided'],
    },
    category: {
        type: String,
        enum: ['event', 'task', 'reminder'],
        required: [true, 'Category must be Provided'],
    },
    startDate: {
        type: Date,
        required: [true, 'start Date must be provided'],
    },
    endDate: {
        type: Date,
        default: null,
    },
    startTime: {
        type: timeSchema,
        required: [true, 'start Time must be provided'],
    },
    endTime: {
        type: timeSchema,
        default: null,
    },
    attendee: {
        type: Array,
        required: null,
    },
    createdOn: {
        type: Date,
        required: true,
    },
    notification: {
        type: Boolean,
        default: false,
    },
    notifyBefore: {
        type: Number,
        default: 15,
    },
    location: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    createdBy: {
        type: String,
        required: [true, 'Created by must be provided'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
    },
});

module.exports = mongoose.model('Event', EventSchema);
