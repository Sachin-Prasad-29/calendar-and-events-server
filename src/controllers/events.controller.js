const { createHttpError } = require('../errors/custom-error');
const { addEventSvc, getEventsSvc } = require('../services/event.service');
const jwt = require('jsonwebtoken');
const { query } = require('../models/Time');

const getEvents = async (req, res, next) => {
    const {
        page,
        title,
        category,
        startDate,
        endDate,
        startTime,
        endTime,
        createdOn,
        location,
        keyword,
        createdBy,
        completed,
    } = req.query;
    //console.log(req.query);
    const queryObject = {};
    if (title) {
        queryObject.title = title;
    }
    if (category) {
        queryObject.category = category;
    }
    if (startDate) {
        queryObject.startDate = startDate;
    }
    if (endDate) {
        queryObject.endDate = endDate;
    }
    if (startTime) {
        queryObject.startTime = startTime;
    }
    if (endTime) {
        queryObject.endTime = endTime;
    }
    if (createdOn) {
        queryObject.createdOn = createdOn;
    }
    if (location) {
        queryObject.location = location;
    }
    if (keyword) {
        queryObject.keyword = keyword;
    }
    if (createdBy) {
        queryObject.createdBy = createdBy;
    }
    if (completed) {
        queryObject.completed = completed;
    }
    console.log(queryObject);
    const allEvents = await getEventsSvc(page, queryObject);
    res.status(201).json({ status: 'success', count: allEvents.length, data: allEvents });
};
const addEvent = async (req, res, next) => {
    const data = req.body;

    data.createdBy = res.locals.claims.email;
    if (!data.attendee) data.attendee = [];
    data.attendee.push(res.locals.claims.email);

    if (Object.keys(data).length === 0) {
        const httpError = createHttpError('Body is missing', 400);
        next(httpError);
        return;
    }
    const insertedEvent = await addEventSvc(data);
    res.status(201).json({ status: 'success', data: insertedEvent });
};

const getAEvent = async (req, res) => {
    res.status(201).json({ status: 'Success to get a Event' });
};

const editEvent = async (req, res) => {
    res.status(201).json({ status: 'Success getEvent', data: req.body });
};

const deleteEvent = async (req, res) => {
    res.status(201).json({ status: 'Success Delete Event' });
};

const excuseEvent = async (req, res) => {
    res.status(201).json({ status: 'Success exuse Event' });
};

module.exports = {
    getEvents,
    addEvent,
    getAEvent,
    editEvent,
    deleteEvent,
    excuseEvent,
};
