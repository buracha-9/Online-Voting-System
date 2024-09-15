const express = require('express');
const router = express.Router();
const voteController = require('../../controllers/voteController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');

// Route to cast a vote (voter only)
router.post('/', verifyJWT, verifyRoles(ROLES_LIST.VOTER), voteController.castVote);

// Route to count votes for an election (admin only)
router.get('/count/:electionId', verifyJWT, verifyRoles(ROLES_LIST.ADMIN), async (req, res) => {
    try {
        const results = await voteController.countVotes(req.params.electionId);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error counting votes' });
    }
});

// Route to calculate results for an election (admin only)
router.post('/results/:electionId', verifyJWT, verifyRoles(ROLES_LIST.ADMIN), voteController.calculateResults);

// Route to get results for an election (publicly accessible or requires authentication)
router.get('/results/:electionId', voteController.getResults);

module.exports = router;
