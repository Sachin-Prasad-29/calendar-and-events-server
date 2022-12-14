require('dotenv').config();
require('express-async-errors');
const express = require('express');
var bodyParser = require('body-parser');
const userApiRouter = require('./routes/users.routes');
const eventsApiRouter = require('./routes/events.routes');
const todoApiRouter = require('./routes/todos.routes');
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { connectDB } = require('./db/connect');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();

//to avoid cors policy error
app.use(cors({ origin: '*' }));

// to allow file upload for the cloudnary
app.use(fileUpload({ useTempFiles: true }));

// standard middleware
//to take care of the data present in the body from req.body which are in json format
app.use(express.json());

// to take care the data submitted using the form  as string format
app.use(bodyParser.urlencoded({ extended: true }));

//setting routes middleware
app.get('/', (req, res) => {
    res.send(
        '<div style="width:200px; margin: auto auto;"><img width="100%"  src="https://media.tenor.com/2jd3xi2WVt0AAAAC/recurring-settings.gif"></div><div style="width:220px; margin: 0 auto;"><h2>Server is Running...</h2></div>'
    );
});
app.use('/api/auth', userApiRouter);
app.use('/api/events', eventsApiRouter);
app.use('/api/todo', todoApiRouter);

// error handling middlewares
app.use(notFound); // custom 404 page( middleware);
app.use(errorHandlerMiddleware); // custom error handler for handing all the errors

const port = process.env.PORT || 5001;

const start = async () => {
    try {
        //connection to the database
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
};
//starting the server
start();
