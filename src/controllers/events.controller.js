const { createHttpError } = require('../errors/custom-error');
const {
    addEventSvc,
    getEventsSvc,
    getEventByIdSvc,
    editEventSvc,
    deleteEventSvc,
    excuseEventSvc,
} = require('../services/event.service');
const jwt = require('jsonwebtoken');

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

    console.log(queryObject);
    const allEventDetails = await getEventsSvc(page, queryObject);
    res.status(201).json({ status: 'true', data: allEventDetails });
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
    const insertedEvent = await addEventSvc(eventData);
    res.status(201).json({ status: 'true', data: insertedEvent });
};

const getEventById = async (req, res) => {
    const eventId = req.params.id;
    const eventDetails = await getEventByIdSvc(eventId);
    res.status(201).json({ status: 'true', data: eventDetails });
};

const editEvent = async (req, res) => {
    const eventId = req.params.id;
    const eventDetails = req.body;
    const updatedEvent = await editEventSvc(eventId, eventDetails);
    res.status(201).json({ status: 'true', data: updatedEvent });
};

const deleteEvent = async (req, res) => {
    const eventId = req.params.id;
    const deletedEventDetails = await deleteEventSvc(eventId);
    res.status(201).json({ status: 'true', data: deletedEventDetails });
};

const excuseEvent = async (req, res) => {
    const eventId = req.params.id;
    const userEmail = res.locals.claims.email;
    const allUsers = req.body;
    console.log('Before', allUsers);
    const index = allUsers.attendee.indexOf(userEmail);
    allUsers.attendee.splice(index, 1);
    console.log('after', allUsers);
    const excusedEvent = await excuseEventSvc(eventId, allUsers.attendee);
    res.status(201).json({ status: 'true', data: excusedEvent });
};

module.exports = {
    getEvents,
    addEvent,
    getEventById,
    editEvent,
    deleteEvent,
    excuseEvent,
};
