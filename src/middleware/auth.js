const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');

    jwt.verify(token, process.env.JWT_SECRET, function (err, claims) {
        if (err) {
            const error = new Error('Bad credentials');
            error.status = 401;
            next(error);
            return;
        }

        res.locals.claims = claims;

        next();
    });
};

module.exports = { authenticate };
