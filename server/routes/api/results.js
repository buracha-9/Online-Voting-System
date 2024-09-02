const express = require('express');
const router = express.Router();
const voteController = require('../../controllers/voteController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');
const auditLogger = require('../../middleware/auditLogger'); // Import the audit logger

// Route to count votes for an election
router.get('/count/:electionId', verifyJWT, verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    try {
        const results = await voteController.countVotes(req.params.electionId);

        // Log the action for auditing
        auditLogger(req.user.id, 'COUNT_VOTES', `Counted votes for electionId: ${req.params.electionId}`);

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Failed to count votes' });
    }
});

// Route to calculate results for an election
router.get('/calculate/:electionId', verifyJWT, verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    try {
        await voteController.calculateResults(req, res);

        // Log the action for auditing
        auditLogger(req.user.id, 'CALCULATE_RESULTS', `Calculated results for electionId: ${req.params.electionId}`);
    } catch (err) {
        res.status(500).json({ message: 'Failed to calculate results' });
    }
});

// Route to get results for an election
router.get('/results/:electionId', verifyJWT, verifyRoles(ROLES_LIST.Admin), async (req, res) => {
    try {
        await voteController.getResults(req, res);

        // Log the action for auditing
        auditLogger(req.user.id, 'GET_RESULTS', `Retrieved results for electionId: ${req.params.electionId}`);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get results' });
    }
});

module.exports = router;
