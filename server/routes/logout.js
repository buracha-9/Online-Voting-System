const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');

// Route to handle logout
router.post('/logout', logoutController.handleLogout);

module.exports = router;
