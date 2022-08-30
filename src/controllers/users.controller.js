const { createHttpError } = require('../errors/custom-error');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const {
    addUser,
    getUserByEmail,
    checkPassword,
    getProfileSvc,
    editProfileSvc,
    getAllUsersSvc,
} = require('../services/user.service');
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
    userToSend.success = true;
    res.status(201).json(userToSend);
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
        id: user._id,
        name: user.name,
        email: user.email,
    };
    jwt.sign(claims, process.env.JWT_SECRET, function (error, token) {
        // some problem in generating JWT
        if (error) {
            const httpError = createHttpError('Internal Server Error', 500);
            next(httpError);
        }
        const userDetails = {
            name: user.name,
            email: user.email,
            token: token,
            success: true,
        };
        res.status(201).json(userDetails);
    });
};

const getProfile = async (req, res) => {
    const userId = res.locals.claims.id;
    const userDetails = await getProfileSvc(userId);

    let userToSend = { ...userDetails.toObject() };
    delete userToSend.password;

    userToSend.success = true;
    res.status(201).json(userToSend);
};

const editProfilePic = async (req, res) => {
    const file = req.files.photo;

    const userId = res.locals.claims.id;
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        const data = { profilePic: result.url };
        const userDetails = await editProfileSvc(userId, data);

        let userToSend = { ...userDetails.toObject() };
        delete userToSend.password;
        userToSend.success = true;
        res.status(201).json(userToSend);
    });
};

const editProfile = async (req, res) => {
    const data = req.body;
    const userId = res.locals.claims.id;

    const userDetails = await editProfileSvc(userId, data);

    let userToSend = { ...userDetails.toObject() };
    delete userToSend.password;
    userToSend.success = true;
    res.status(201).json(userToSend);
};

const getAllUsers = async (req, res) => {
    const alluserDetails = await getAllUsersSvc();
    alluserDetails.success = true;
    res.status(201).json(alluserDetails);
};

module.exports = {
    register,
    login,
    getProfile,
    editProfilePic,
    editProfile,
    getAllUsers,
};
