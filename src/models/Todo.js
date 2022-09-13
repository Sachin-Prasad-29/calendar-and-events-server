const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Todo Name must be Provided'],
    },
    createdBy: {
        type: String,
        required: [true, 'Created by must be provided'],
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Todo', TodoSchema);
