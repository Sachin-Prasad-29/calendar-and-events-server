const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getEvents, addEvent, editEvent, deleteEvent, excuseEvent } = require('../controllers/events.controller');
const router = express.Router();

router.get('/', authenticate, getEvents);
router.post('/', authenticate, addEvent);
router.patch('/:id', authenticate, editEvent);
router.delete('/:id', authenticate, deleteEvent);
router.patch('/:id/excuse', authenticate, excuseEvent);

module.exports = router;
