const Candidate = require('../model/Candidate');

// Update a candidate
const updateCandidate = async (req, res) => {
    const { id } = req.params;
    const { name, party } = req.body;

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });

        if (name) candidate.name = name;
        if (party) candidate.party = party;

        const result = await candidate.save();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Remove a candidate
const removeCandidate = async (req, res) => {
    const { id } = req.params;

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });

        await candidate.remove();
        res.json({ message: 'Candidate removed.' });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// List candidates for an election
const listCandidates = async (req, res) => {
    const { electionId } = req.params;

    try {
        const candidates = await Candidate.find({ electionId });
        if (!candidates.length) return res.status(204).json({ message: 'No candidates found for this election.' });
        res.json(candidates);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Get a candidate by ID
const getCandidateById = async (req, res) => {
    const { id } = req.params;

    try {
        const candidate = await Candidate.findById(id);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });
        res.json(candidate);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

module.exports = {
    updateCandidate,
    removeCandidate,
    listCandidates,
    getCandidateById
};
