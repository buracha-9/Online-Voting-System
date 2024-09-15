// server/routes/api/employees.js
const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/rolesList');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles'); // Import verifyRoles middleware

router.route('/')
    .get(verifyJWT, employeesController.getAllEmployees)
    .post(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), employeesController.createNewEmployee)

router.route('/:id')
    .get(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), employeesController.getEmployee)
    .put(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), employeesController.updateEmployee)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.ADMIN), employeesController.deleteEmployee)

module.exports = router;
