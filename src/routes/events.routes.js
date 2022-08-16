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
router.post('/', authenticate, addEvent);
router.get('/:id', authenticate, getAEvent);
router.patch('/:id', authenticate, editEvent);
router.delete('/:id', authenticate, deleteEvent);
router.patch('/:id/excuse', authenticate, excuseEvent);

module.exports = router;
