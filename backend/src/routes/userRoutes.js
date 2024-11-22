const express = require('express');
const User = require('../models/Users');
const authMiddleware = require('../middleware/authMiddleware');
const authenticationController = require('../controllers/auth');
const userController = require('../controllers/userControllers');

const router = express.Router();

router.post('/register', authenticationController.registerUser);

router.post('/login', authenticationController.loginUser);

router.get('/profile', userController.getUser);

router.patch('/profile', userController.updateUser);

router.delete('/profile', userController.deleteUser);

router.get('/owners', authMiddleware, userController.getOwnersForVet);

// route to check email uniqueness when registering
router.post('/check-email', async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } }); // Adjust based on your database
        if (existingUser) {
            return res.status(400).json({ message: "Email is already linked to another account." });
        }
        return res.status(200).json({ message: "Email is available." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error. Please try again later." });
    }
});

module.exports = router;

