const { createHttpError } = require('../errors/custom-error');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp')

const checkUser = async (email) => {
    const user = await User.findOne({email})
    if(user) return true;
    return false
}

const getUserForVerificatoin = async (email) =>{
    const userDetails = await Otp.find({email});
    if(!userDetails || userDetails.length === 0){
        const error = createHttpError('Otp has been expired', 400);
        throw error;
    }
    return userDetails;
}

const generateOtpSvc = async (credentials)=>{
    
    const response = await Otp.create(credentials);
    if(!response){
        const error = createHttpError('Bad Credentials', 400);
        throw error;
    }
    return response;
}


const registerUserSvc = async (user) => {
    const insertedUser = await User.create(user);
    if (!insertedUser) {
        const error = createHttpError('Bad Credentials', 400);
        throw error;
    }
    await Otp.deleteMany({email:user.email})
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
    checkUser,
    getUserForVerificatoin,
    generateOtpSvc,
    registerUserSvc,
    getUserByEmail,
    checkPassword,
    getProfileSvc,
    editProfilePicSvc,
    editProfileSvc,
    getAllUsersSvc,
};
