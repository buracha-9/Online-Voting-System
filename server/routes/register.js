const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// This route is accessible to the admin only
router.post('/', registerController.registerEmployee);

module.exports = router;
