const { createHttpError } = require('../errors/custom-error');
const Event = require('../models/Event');

const getAllEventsSvc = async (queryObject) => {
    try {
        const allEvents = await Event.find(queryObject);
        if (!allEvents) {
            const error = createHttpError(`No Event Found `, 400);
            throw error;
        }
        return allEvents;
    } catch (error) {
        throw error;
    }
};

const getEventsSvc = async (_page, queryObject) => {
    try {
        let result = Event.find(queryObject).sort({ startDate: 1 });
        const page = _page || 1;
        skip = (page - 1) * 10;

        result = result.skip(skip).limit(10);
        if (!result) {
            const error = createHttpError(`No Event Found `, 400);
            throw error;
        }
        const allEvents = await result;
        return allEvents;
    } catch (error) {
        throw error;
    }
};

const addEventSvc = async (data) => {
    try {
        const insertedEvent = await Event.create(data);
        if (!insertedEvent) {
            const error = createHttpError(`Bad Request`, 400);
            throw error;
        }
        return insertedEvent;
    } catch (error) {
        if ((error.name = 'ValidationError')) {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = 'ValidationError';
            throw dbError;
        }
        if (error.name === 'CastError') {
            const dbError = new Error(`Data Type Error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
        throw error;
    }
};

const getEventByIdSvc = async (eventId) => {
    try {
        const eventDetails = await Event.findById({ _id: eventId });
        if (!eventDetails) {
            const error = createHttpError(`No Event Found with Given Id`, 404);
            throw error;
        }
        return eventDetails;
    } catch (error) {
        if (error.name === 'CastError') {
            const dbError = new Error(`Data Type error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
        if (error.type === 'NotFound') {
            throw error;
        }
        throw error;
    }
};

const editEventSvc = async (eventId, eventDetails) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate({ _id: eventId }, eventDetails, {
            new: true,
            runValidators: true,
        });
        if (!updatedEvent) {
            const error = createHttpError('No Event Found with Given Id', 404);
            throw error;
        }
        return updatedEvent;
    } catch (error) {
        if (error.name === 'CastError') {
            const dbError = new Error(`Data Type error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
        if (error.type === 'NotFound') {
            throw error;
        }
        throw error;
    }
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
    if (!excusedEvent) {
        const error = createHttpError(`No Event Found with Given Id`, 404);
        throw error;
    }
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
