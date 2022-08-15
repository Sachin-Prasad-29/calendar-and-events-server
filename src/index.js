require('dotenv').config();
require('express-async-errors');  // this will allow to 
const express = require('express');
const userApiRouter = require('./routes/users.routes');
const eventsApiRouter = require('./routes/events.routes');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { connectDB } = require('./db/connect');
const app = express();

// standard middleware
app.use(express.json()); // to get json data from req.body
app.use(express.urlencoded());

//setting routes middleware
app.use('/api/auth', userApiRouter);
app.use('/api/events', eventsApiRouter);

// error handling middlewares
app.use(notFound); // custom 404 page( middleware);
app.use(errorHandlerMiddleware); // custom error handler for handing all the errors

const port = process.env.PORT || 5001;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};

start();
