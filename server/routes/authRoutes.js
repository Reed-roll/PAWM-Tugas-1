const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Protected route
router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Protected route', user: req.user });
});

module.exports = router;