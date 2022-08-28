const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const clintId = require('../config/googleData').clintId;
const clientSecreT = require('../config/googleData').clientSecret;

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: clientId,
                clientSecret: clientSecreT,
                callbackURL: 'http://localhost:5001/google/callback',
            },(accessToken, refreshToken, profile, done) => {
                console.log(profile)

                //find if user exist or not
            }
        ));
};
