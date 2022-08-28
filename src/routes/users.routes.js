const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
    register,
    login,
    getProfile,
    editProfilePic,
    editProfile,
    getAllUsers,
} = require('../controllers/users.controller');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.patch('/profilepic', authenticate, editProfilePic);
router.patch('/profile', authenticate, editProfile);
router.get('/users', authenticate, getAllUsers);

// router.get('/google', (req, res) => {});
// router.get('/google/callback', (req, res) => {});

module.exports = router;
