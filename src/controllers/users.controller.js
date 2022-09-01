const { createHttpError } = require('../errors/custom-error');
const _ = require('lodash');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const {
    checkUser,
    generateOtpSvc,
    registerUserSvc,
    getUserByEmail,
    checkPassword,
    getProfileSvc,
    editProfileSvc,
    getAllUsersSvc,
    getUserForVerificatoin,
} = require('../services/user.service');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const generateOtp = async (req, res, next) => {
    const user = req.body;

    if (Object.keys(user).length === 0) {
        const httpError = createHttpError('Body is missing', 400);
        next(httpError);
        return;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    //check for existing user
    if (await checkUser(email)) {
        return res.status(400).send({ success: false, msg: 'User Already Registered' });
    }

    const OTP = otpGenerator.generate(4, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    console.log(OTP);
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Registration Verification Code',
        html: `<div> <h2>Hi ${name},</h2>
        <div> <h1> ${OTP} </h1> <h2>Is your one time password(otp) for the Registration of Calendar and Event app.If you did not request this code, it is possible that someone else is trying to access the  Account ${email}. Do not forward or give this code to anyone.</h2></div>
        `,
    };
    transporter.sendMail(mailOptions);
    const credentials = { email: email, name: name, password: password, otp: OTP };
    const salt = await bcrypt.genSalt(10);
    credentials.otp = await bcrypt.hash(credentials.otp, salt);

    const result = await generateOtpSvc(credentials);
    return res.status(200).json({ success: true, msg: 'Otp send successfully' });
};

const verifyOtp = async (req, res) => {
    const otpHolder = await getUserForVerificatoin(req.body.email);

    const rightOtpFind = otpHolder[otpHolder.length - 1];

    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    console.log(validUser);
    if (validUser) {
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const user = { email, name, password };
        const insertedUser = await registerUserSvc(user);
        const userToSend = {
            ...insertedUser.toObject(),
        };
        delete userToSend.password;
        userToSend.success = true;
        res.status(201).json(userToSend);
    } else res.status(409).json({ success: false, msg: 'Invalid OTP, Please try again !' });
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
    generateOtp,
    verifyOtp,
    login,
    getProfile,
    editProfilePic,
    editProfile,
    getAllUsers,
};
