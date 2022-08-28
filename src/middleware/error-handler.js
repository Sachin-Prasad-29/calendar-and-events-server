const { CustomAPIError } = require('../errors/custom-error');

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        err.message.success = false;
        return res.status(err.statusCode).json(err.message);
    }
    return res
        .status(500)
        .json({ success: false, status: 'Something went wrong. Please try again', message: err.message });
};
module.exports = errorHandlerMiddleware;
