const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
    generateOtp,
    verifyOtp,
    login,
    getProfile,
    editProfilePic,
    editProfile,
    getAllUsers,
    deleteProfilePic,
} = require('../controllers/users.controller')
const router = express.Router();

router.post('/register', generateOtp);
router.post('/register/verify',verifyOtp)
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.patch('/profilepic', authenticate, editProfilePic);
router.delete('/profilepic', authenticate, deleteProfilePic)
router.patch('/profile', authenticate, editProfile);
router.get('/users', authenticate, getAllUsers);

// router.get('/google', (req, res) => {});
// router.get('/google/callback', (req, res) => {});

module.exports = router;
