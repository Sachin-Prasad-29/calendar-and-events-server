const { createHttpError } = require('../errors/custom-error');
const nodemailer = require('nodemailer');

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

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

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
    const { page, name, category, startDate, createdOn, keyword, createdBy, completed } = req.query;

    //console.log(req.query);
    const queryObject = {};
    queryObject.attendee = userEmail;

    //filter based on title
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
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

    //filter based on keyboard
    if (keyword) {
        queryObject.details = { $regex: keyword, $options: 'i' };
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

    const emails = insertedEvent.attendee;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: emails,
        subject: 'New Event Added',
        html: `<div>
        <div style="font-size: 30px; background-color: rgb(0, 140, 255); color: white; padding: 40px 10px">
            Hi Folks,
        </div>

        <div style="background-color: white; color: rgb(52, 96, 240)">
            <hr />
            <br />
            <br />
            <div style="font-size: 25px; padding:10px ; ">A new ${insertedEvent.category} is added to your Calendar.</div>
            <br />
            <br />
            <div style="font-size: 25px;padding:10px ;">${insertedEvent.category} name : ${insertedEvent.name}.</div>
            <br />
            <br />
            <div style="font-size: 25px;padding:10px ;">Start Date : ${insertedEvent.startDate}.</div>
            <br />
            <br />
            <div style="font-size: 25px;padding:10px ;">Attendees : ${emails}.</div>
            <br />
            <br />
            <br />
            <div style="font-size: 25px ;padding:10px ;">Thanks and Regards</div>
            <br>
            <div style="font-size: 25px; padding:10px ;">Calendar Team</div>
        </div>
    </div>
        `,
    };
    transporter.sendMail(mailOptions);

    const eventDetail = { success: true, events: insertedEvent };
    res.status(201).json(eventDetail);
};

const getEventById = async (req, res) => {
    const eventId = req.params.id;
    const fetchedEvent = await getEventByIdSvc(eventId);
    const eventDetail = { success: true, events: fetchedEvent };
    res.status(201).json(eventDetail);
};

const editEvent = async (req, res) => {
    const eventId = req.params.id;
    const eventDetails = req.body;

    console.log(eventDetails);
    const updatedEvent = await editEventSvc(eventId, eventDetails);
    const eventDetail = { success: true, events: updatedEvent };
    res.status(201).json(eventDetail);
};

const deleteEvent = async (req, res) => {
    const eventId = req.params.id;
    const deletedEventDetails = await deleteEventSvc(eventId);
    const eventDetail = { success: true, events: deletedEventDetails };
    res.status(201).json(eventDetail);
};

const excuseEvent = async (req, res) => {
    const eventId = req.params.id;
    const userEmail = res.locals.claims.email;
    const event = req.body;

    const index = event.attendee.indexOf(userEmail);
    event.attendee.splice(index, 1);

    const excusedEvent = await excuseEventSvc(eventId, event.attendee);
    const eventDetail = { success: true, events: excusedEvent };
    res.status(201).json(eventDetail);
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
