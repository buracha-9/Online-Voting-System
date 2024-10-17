const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');

// Admin route for managing users
router.get('/users', verifyJWT, verifyRoles(ROLES_LIST.ADMIN), adminController.getAllUsers);

// Admin route for viewing audit logs
router.get('/logs', verifyJWT, verifyRoles(ROLES_LIST.ADMIN), adminController.viewAuditLogs);

// Admin route for system configuration
router.post('/config', verifyJWT, verifyRoles(ROLES_LIST.ADMIN), adminController.updateConfig);

//Adimin route for system stats
router.get('/stats', verifyJWT, verifyRoles(ROLES_LIST.ADMIN), adminController.getSystemStats);

module.exports = router;
