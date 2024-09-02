const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');

// Admin route for managing users
router.get('/users', verifyJWT, verifyRoles(ROLES_LIST.Admin), adminController.getAllUsers);

// Admin route for viewing audit logs
router.get('/logs', verifyJWT, verifyRoles(ROLES_LIST.Admin), adminController.viewAuditLogs);

// Admin route for system configuration
router.post('/config', verifyJWT, verifyRoles(ROLES_LIST.Admin), adminController.updateConfig);

module.exports = router;
