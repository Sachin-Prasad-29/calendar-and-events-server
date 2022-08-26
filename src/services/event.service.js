
const { createHttpError } = require('../errors/custom-error');

const Event = require('../models/Event');

const getAllEventsSvc = async (queryObject) => {
    const allEvents = await Event.find(queryObject);
    if (!allEvents) {
        const error = createHttpError(`No Event Found `, 400);
        throw error;
    }
    return allEvents;
};

const getEventsSvc = async (_page, queryObject) => {
    let result = Event.find(queryObject);
    const page = _page || 1;
    skip = (page - 1) * 10;

    result = result.skip(skip).limit(10);
    if (!result) {
        const error = createHttpError(`No Event Found `, 400);
        throw error;
    }
    const allEvents = await result;
    return allEvents;
};

const addEventSvc = async (data) => {
    const insertedEvent = await Event.create(data);
    if (!insertedEvent) {
        const error = createHttpError(`Bad Request`, 400);
        throw error;
    }
    return insertedEvent;
};

const getEventByIdSvc = async (eventId) => {
    const eventDetails = await Event.findById({ _id: eventId });
    if (!eventDetails) {
        const error = createHttpError(`No Event Found with Given Id`, 404);
        throw error;
    }
    return eventDetails;
};

const editEventSvc = async (eventId, eventDetails) => {
    const updatedEvent = await Event.findByIdAndUpdate({ _id: eventId }, eventDetails, {
        new: true,
        runValidators: true,
    });
    if (!updatedEvent) {
        const error = createHttpError('No Event Found with Given Id', 404);
        throw error;
    }
    return updatedEvent;
};

const deleteEventSvc = async (eventId) => {
    const deletedEventDetails = await Event.findByIdAndDelete({ _id: eventId });
    if (!deletedEventDetails) {
        const error = createHttpError(`No Event Found with Given Id`, 404);
        throw error;
    }
    return deletedEventDetails;
};

const excuseEventSvc = async (eventId, allUsers) => {
    const excusedEvent = await Event.findByIdAndUpdate(
        { _id: eventId },
        { attendee: allUsers },
        {
            new: true,
            runValidators: true,
        }
    );
    return excusedEvent;
};

module.exports = {
    getAllEventsSvc,
    getEventsSvc,
    addEventSvc,
    getEventByIdSvc,
    editEventSvc,
    deleteEventSvc,
    excuseEventSvc,
};
