const express = require('express');
const router = express.Router();
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');
const electionController = require('../../controllers/electionController');

// Get all elections (publicly accessible or requires authentication)
router.get('/', electionController.getAllElections);

// Create a new election (admin only)
router.post('/', verifyJWT, verifyRoles(ROLES_LIST.Admin), electionController.createNewElection);

// Update an election (admin only)
router.put('/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), electionController.updateElection);

// Delete an election (admin only)
router.delete('/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), electionController.deleteElection);

// Get a single election by ID (publicly accessible or requires authentication)
router.get('/:id', electionController.getElectionById);

module.exports = router;
