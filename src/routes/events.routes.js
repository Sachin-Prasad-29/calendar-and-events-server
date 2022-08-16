const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
    getEvents,
    addEvent,
    getAEvent,
    editEvent,
    deleteEvent,
    excuseEvent,
} = require('../controllers/events.controller');
const router = express.Router();

router.get('/', getEvents);
router.post('/', addEvent);
router.get('/:id', getAEvent);
router.patch('/:id', editEvent);
router.delete('/:id', deleteEvent);
router.patch('/:id/excuse', excuseEvent);

module.exports = router;
