const express = require('express');
const router = express.Router();
const voteController = require('../../controllers/voteController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');

// Route to cast a vote
router.post('/', verifyJWT, verifyRoles(ROLES_LIST.VOTER), voteController.castVote);

module.exports = router;
