const Candidate = require('../model/Candidate'); // Assuming the model is still called Candidate

// Update a nominee
const updateCandidate = async (req, res) => {
    const { id } = req.params;
    const { name, awardEventId } = req.body; // Changed 'category' to 'awardEventId'

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) return res.status(404).json({ message: 'Nominee not found.' });

        if (name) candidate.name = name;
        if (awardEventId) candidate.awardEventId = awardEventId; // Use awardEventId instead

        const result = await candidate.save();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Remove a nominee
const removeCandidate = async (req, res) => {
    const { id } = req.params;

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) return res.status(404).json({ message: 'Nominee not found.' });

        await candidate.remove();
        res.json({ message: 'Nominee removed.' });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// List nominees for an award event
const listCandidates = async (req, res) => {
    const { awardEventId } = req.params; // Changed electionId to awardEventId

    try {
        const candidates = await Candidate.find({ awardEventId });
        if (!candidates.length) return res.status(204).json({ message: 'No nominees found for this award event.' });
        res.json(candidates);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Get a nominee by ID
const getCandidateById = async (req, res) => {
    const { id } = req.params;

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) return res.status(404).json({ message: 'Nominee not found.' });
        res.json(candidate);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

module.exports = {
    updateCandidate, // Update a nominee's info
    removeCandidate, // Remove a nominee
    listCandidates,  // List all nominees for a specific award event
    getCandidateById // Retrieve nominee details by their ID
};
