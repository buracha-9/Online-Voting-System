const express = require('express');
const router = express.Router();
const nomineeController = require('../../controllers/nomineeController'); // Updated to nomineeController
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');

// Update a nominee (admin only)
router.put('/:id', verifyJWT, verifyRoles(ROLES_LIST.ADMIN), nomineeController.updateNominee);

// Remove a nominee (admin only)
router.delete('/:id', verifyJWT, verifyRoles(ROLES_LIST.ADMIN), nomineeController.removeNominee);

// List nominees for an award event
router.get('/award/:awardEventId', nomineeController.listNominees); // Ensure consistency

// Get a nominee by ID
router.get('/:id', nomineeController.getNomineeById);

module.exports = router;
