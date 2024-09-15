const express = require('express');
const router = express.Router();
const candidateController = require('../../controllers/candidateController');
const verifyJWT = require('../../middleware/verifyJWT'); // Import JWT verification middleware
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');

// Update a candidate (admin only)
router.put('/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), candidateController.updateCandidate);

// Remove a candidate (admin only)
router.delete('/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), candidateController.removeCandidate);

// List candidates for an election (publicly accessible or requires authentication based on use case)
// Consider adding authentication based on your use case
router.get('/election/:electionId', candidateController.listCandidates);

// Get a candidate by ID (publicly accessible or requires authentication based on use case)
// Consider adding authentication based on your use case
router.get('/:id', candidateController.getCandidateById);

module.exports = router;
