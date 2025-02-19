const express = require('express');
const router = express.Router();
const usersController = require('../controllers/registerController');
const ROLES_LIST = require('../config/rolesList');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');

// Routes for user management
router.route('/')
    .get(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), usersController.getAllUsers) // Restricted to admins
    .post(usersController.registerUser); // Open for registration, no JWT required

router.route('/:id')
    .get(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), usersController.getUser) // Restricted to admins
    .put(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), usersController.updateUser) // Restricted to admins
    .delete(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), usersController.deleteUser); // Restricted to admins

module.exports = router;
