const { CustomAPIError } = require('../errors/custom-error');

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({success:false, msg: err.message });
    }
    console.log(err.message);
    return res.status(500).json({ success: false, status: 'Something went wrong. Please try again', msg: err.message });
};
module.exports = errorHandlerMiddleware;
