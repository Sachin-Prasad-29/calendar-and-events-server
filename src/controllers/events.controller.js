const getEvents = async (req, res) => {
    res.status(201).json({ status: 'Success getEvents' });
};
const addEvent = async (req, res) => {
    res.status(201).json({ status: 'Success addEvent', data: req.body });
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
    editEvent,
    deleteEvent,
    excuseEvent
}
