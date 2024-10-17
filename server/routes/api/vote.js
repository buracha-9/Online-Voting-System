const express = require('express');
const router = express.Router();
const voteController = require('../../controllers/voteController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');

// Route to cast a vote (voter only)
router.post('/', verifyJWT, verifyRoles(ROLES_LIST.VOTER), voteController.castVote);

// Route to calculate results for an election (admin only)
router.post('/results/:electionID', verifyJWT, verifyRoles(ROLES_LIST.ADMIN), voteController.calculateResults);

// Route to count votes for a candidate in an election (admin only)
router.get('/count/:electionID', verifyJWT, verifyRoles(ROLES_LIST.ADMIN), async (req, res) => {
    try {
        const results = await voteController.calculateResults(req, res); // Pass req and res to call the controller method
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error counting votes' });
    }
});

module.exports = router;
