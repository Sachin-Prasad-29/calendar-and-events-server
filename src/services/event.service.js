const { createHttpError } = require('../errors/custom-error');
const Event = require('../models/Event');

const addEventSvc = async (data) => {
    const insertedEvent = await Event.create(data);
    if (!insertedEvent) {
        const error = createHttpError(`Bad Request`, 400);
        throw error;
    }
    return insertedEvent;
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

module.exports = {
    addEventSvc,
    getEventsSvc,
};
