const { createHttpError } = require('../errors/custom-error');
const { addUser, getUserByEmail, checkPassword, updateProfilePic } = require('../services/user.service');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    const user = req.body;
    if (Object.keys(user).length === 0) {
        const httpError = createHttpError('Body is missing', 400);
        next(httpError);
        return;
    }
    const insertedUser = await addUser(user);
    const userToSend = {
        ...insertedUser.toObject(),
    };
    delete userToSend.password;
    res.status(201).json({ status: 'success', data: userToSend });
};

const login = async (req, res, next) => {
    const credentials = req.body;
    if (!(credentials?.email && credentials?.password)) {
        const httpError = createHttpError('Bad request', 400);
        next(httpError);
        return;
    }
    const { email, password } = credentials;

    const user = await getUserByEmail(email);

    await checkPassword(user, password);
    const claims = {
        name: user.name,
        email: user.email,
    };
    jwt.sign(claims, process.env.JWT_SECRET, function (error, token) {
        // some problem in generating JWT
        if (error) {
            const httpError = createHttpError('Internal Server Error', 500);
            next(httpError);
        }

        res.status(201).json({
            status: 'success',
            data: {
                name: user.name,
                email: user.email, // useful for frontend app
                // token: token
                token,
            },
        });
    });
};

const getProfile = async (req, res) => {
    res.status(201).json({ status: 'Success Veiw Profile' });
};
const editProfile = async (req, res) => {
    const data = req.body;
    console.log(data);
    res.status(201).json({ status: 'Success edited the profile', data: data });
};

module.exports = {
    register,
    login,
    getProfile,
    editProfile,
};
