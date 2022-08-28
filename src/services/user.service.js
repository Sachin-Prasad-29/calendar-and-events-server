const { createHttpError } = require('../errors/custom-error');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const addUser = async (user) => {
    const insertedUser = await User.create(user);
    if (!insertedUser) {
        const error = createHttpError('Bad Credentials', 400);
        throw error;
    }
    return insertedUser;
};

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user === null) {
        const error = createHttpError('User Not Found with the email', 400);
        throw error;
    }

    return user;
};

const checkPassword = async (user, plainTextPassword) => {
    let isMatch;
    isMatch = await user.checkPassword(plainTextPassword);
    if (!isMatch) {
        const error = createHttpError('The Entered password is not matching', 400);
        throw error;
    }
    return isMatch;
};

const getProfileSvc = async (id) => {
    const userDetails = await User.findById(id);
    if (userDetails === null) {
        const error = createHttpError(`No user found with id: ${id}`, 400);
        throw error;
    }
    return userDetails;
};
const editProfilePicSvc = async () => {};

const editProfileSvc = async (id, data) => {
    const userDetails = await User.findByIdAndUpdate({ _id: id }, data, {
        new: true,
        runValidators: true,
    });
    if (!userDetails) {
        const error = createHttpError(`No user found with id: ${id}`, 400);
        throw error;
    }
    return userDetails;
};
const getAllUsersSvc = async () => {
    let alluserDetails = await User.find({}).select('_id name email profilePic');
    if (!alluserDetails) {
        const error = createHttpError(`Something sent wrong to get All user`, 400);
        throw error;
    }
    return alluserDetails;
};

module.exports = {
    addUser,
    getUserByEmail,
    checkPassword,
    getProfileSvc,
    editProfilePicSvc,
    editProfileSvc,
    getAllUsersSvc,
};
