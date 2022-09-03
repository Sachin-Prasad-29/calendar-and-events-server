const { createHttpError } = require('../errors/custom-error');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');

const checkUser = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (user) return true;
        return false;
    } catch (error) {
        if (error.name === 'ValidationError') {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = 'ValidationError';
            throw dbError;
        }
        if (error.name === 'CastError') {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
        throw error;
    }
};

const getUserForVerificatoin = async (email) => {
    try {
        const userDetails = await Otp.find({ email });
        if (!userDetails || userDetails.length === 0) {
            const error = createHttpError('Otp has been expired', 400);
            throw error;
        }
        return userDetails;
    } catch (error) {
        if (error.name === 'ValidationError') {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = 'ValidationError';
            throw dbError;
        }
        throw error;
    }
};

const generateOtpSvc = async (credentials) => {
    try {
        const response = await Otp.create(credentials);
        if (!response) {
            const error = createHttpError('Bad Credentials', 400);
            throw error;
        }
        return response;
    } catch (error) {
        throw error;
    }
};

const registerUserSvc = async (user) => {
    let insertedUser;
    try {
        insertedUser = await User.create(user);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = 'ValidationError';
            throw dbError;
        }

        if (error.name === 'CastError') {
            const dbError = new Error(`Data type error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }

        throw error;
    }
    if (!insertedUser) {
        const error = createHttpError('Bad Credentials', 400);
        throw error;
    }
    await Otp.deleteMany({ email: user.email });
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
    try {
        isMatch = await user.checkPassword(plainTextPassword);
    } catch (error) {
        const err = createHttpError('Something went wrong checking credentials');
        error.type = 'DBError';
        throw err;
    }
    if (!isMatch) {
        const error = new Error('Bad Credentials');
        error.type = 'BadCredentials';
        throw error;
    }
    return isMatch;
};

const getProfileSvc = async (id) => {
    let userDetails;
    try {
        userDetails = await User.findById(id);
    } catch (error) {
        throw error;
    }
    if (userDetails === null) {
        const error = createHttpError(`No user found with id: ${id}`, 400);
        throw error;
    }
    return userDetails;
};

const editProfileSvc = async (id, data) => {
    let userDetails;
    try {
        userDetails = await User.findByIdAndUpdate({ _id: id }, data, {
            new: true,
            runValidators: true,
        });
    } catch (error) {
        throw error;
    }
    if (!userDetails) {
        const error = createHttpError(`No user found with id: ${id}`, 400);
        throw error;
    }
    return userDetails;
};
const getAllUsersSvc = async () => {
    let alluserDetails;
    try {
        alluserDetails = await User.find({}).select('_id name email profilePic');
    } catch (error) {
        throw error;
    }
    if (!alluserDetails) {
        const error = createHttpError(`Something sent wrong to get All user`, 400);
        throw error;
    }
    return alluserDetails;
};

module.exports = {
    checkUser,
    getUserForVerificatoin,
    generateOtpSvc,
    registerUserSvc,
    getUserByEmail,
    checkPassword,
    getProfileSvc,
    editProfileSvc,
    getAllUsersSvc,
};
