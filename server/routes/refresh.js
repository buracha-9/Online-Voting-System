const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

// Route to handle refresh token
router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;
