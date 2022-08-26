const { createHttpError } = require('../errors/custom-error');
const {
    getAllEventsSvc,
    getEventsSvc,
    addEventSvc,
    getEventByIdSvc,
    editEventSvc,
    deleteEventSvc,
    excuseEventSvc,
} = require('../services/event.service');
const jwt = require('jsonwebtoken');

const getAllEvents = async (req, res) => {
    const userEmail = res.locals.claims.email;
    const queryObject = {};
    queryObject.attendee = userEmail;
    const allEvent = await getAllEventsSvc(queryObject);
    allEventDetails = { success: true, events: allEvent };
    res.status(201).json(allEventDetails);
};

const getEvents = async (req, res) => {
    const userEmail = res.locals.claims.email;
    const { page, title, category, startDate, endDate, createdOn, keyword, createdBy, completed } = req.query;

    //console.log(req.query);
    const queryObject = {};
    queryObject.attendee = userEmail;

    //filter based on title
    if (title) {
        queryObject.title = { $regex: title, $options: 'i' };
    }

    //filter based on category
    if (category) {
        queryObject.category = category;
    }

    //filter based on created Date
    if (createdOn) {
        queryObject.createdOn = {
            $gte: `${createdOn}T00:00:00.000Z`,
            $lt: `${createdOn}T23:59:59.999Z`,
        };
    }

    //filter based on startDate
    if (startDate) {
        queryObject.startDate = {
            $gte: `${startDate}T00:00:00.000Z`,
            $lt: `${startDate}T23:59:59.999Z`,
        };
    }

    //filter based on endDate
    if (endDate) {
        queryObject.endDate = {
            $gte: `${endDate}T00:00:00.000Z`,
            $lt: `${endDate}T23:59:59.999Z`,
        };
    }

    //filter based on keyboard
    if (keyword) {
        queryObject.description = { $regex: keyword, $options: 'i' };
    }

    //filter based on created by
    if (createdBy) {
        queryObject.createdBy = { $regex: createdBy, $options: 'i' };
    }

    //fitler based on completed status
    if (completed) {
        queryObject.completed = completed;
    }

    const allEvent = await getEventsSvc(page, queryObject);
    const allEventDetails = { success: true, events: allEvent };
    res.status(201).json(allEventDetails);
};

const addEvent = async (req, res, next) => {
    const eventData = req.body;

    eventData.createdBy = res.locals.claims.email;
    if (!eventData.attendee) eventData.attendee = [];
    eventData.attendee.push(res.locals.claims.email);

    if (Object.keys(eventData).length === 0) {
        const httpError = createHttpError('Body is missing', 400);
        next(httpError);
        return;
    }
    if (eventData.category === 'event') eventData.color = 'primary';
    if (eventData.category === 'task') eventData.color = 'success';
    if (eventData.category === 'reminder') eventData.color = 'orange';
    const insertedEvent = await addEventSvc(eventData);
    const eventDetail = { success: true, event: insertedEvent };
    res.status(201).json(eventDetail);
};

const getEventById = async (req, res) => {
    const eventId = req.params.id;
    const fetchedEvent = await getEventByIdSvc(eventId);
    const eventDetail = { success: true, event: fetchedEvent };
    res.status(201).json(eventDetail);
};

const editEvent = async (req, res) => {
    const eventId = req.params.id;
    const eventDetails = req.body;
    
    console.log(eventDetails);
    const updatedEvent = await editEventSvc(eventId, eventDetails);
    updatedEvent.success = true;
    res.status(201).json(updatedEvent);
};

const deleteEvent = async (req, res) => {
    const eventId = req.params.id;
    const deletedEventDetails = await deleteEventSvc(eventId);
    deletedEventDetails.success = true;
    res.status(201).json(deletedEventDetails);
};

const excuseEvent = async (req, res) => {
    const eventId = req.params.id;
    const userEmail = res.locals.claims.email;
    const allUsers = req.body;

    const index = allUsers.attendee.indexOf(userEmail);
    allUsers.attendee.splice(index, 1);

    const excusedEvent = await excuseEventSvc(eventId, allUsers.attendee);
    excuseEvent.success = true;
    res.status(201).json(excusedEvent);
};

module.exports = {
    getAllEvents,
    getEvents,
    addEvent,
    getEventById,
    editEvent,
    deleteEvent,
    excuseEvent,
};
