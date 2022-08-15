const { createHttpError } = require('../errors/custom-error');
const User = require('../models/User');

const addUser = async (user) => {
    const insertedUser = await User.create(user);
    return insertedUser;
};

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (user === null) {
        const error = createHttpError('Bad Credentials', 400);
        throw error;
    }

    return user;
};

const checkPassword = async (user, plainTextPassword) => {
    let isMatch;
    isMatch = await user.checkPassword(plainTextPassword);
    if (!isMatch) {
        const error = createHttpError('Bad Credentials Pass', 400);
        throw error;
    }
    return isMatch;
};

const updateProfilePic = async (id, profilePic) => {};

module.exports = {
    addUser,
    getUserByEmail,
    checkPassword,
    updateProfilePic,
};
