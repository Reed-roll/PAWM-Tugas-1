const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

module.exports = router;