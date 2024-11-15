const express = require('express');
const { saveState, getSavedStates } = require('../controllers/stateController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Save state route
router.post('/save', authenticateToken, saveState);

// Get saved states route
router.get('/', authenticateToken, getSavedStates);

module.exports = router;