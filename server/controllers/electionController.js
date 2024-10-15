const mongoose = require('mongoose');
const Election = require('../model/Election');
const Candidate = require('../model/Candidate');

// Get all elections
const getAllElections = async (req, res) => {
    try {
        const elections = await Election.find();
        if (!elections.length) return res.status(204).json({ message: 'No elections found.' });
        res.json(elections);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Create a new election
const createNewElection = async (req, res) => {
    const { title, description, electionID, candidates, startDate, endDate } = req.body;

    // Validate required fields and check for empty electionID
    if (!title || !electionID || electionID.trim() === "" || !startDate || !endDate) {
        return res.status(400).json({ message: 'Title, valid election ID, start date, and end date are required.' });
    }

    // Validate candidate data if provided
    if (candidates && candidates.length > 0) {
        const invalidCandidates = candidates.filter(c => !c.name || !c.party); // Removed hashedId check
        if (invalidCandidates.length) {
            return res.status(400).json({ message: 'Invalid candidate data provided. Each candidate must have a name and party.' });
        }
    }

    try {
        // Check if the electionID already exists
        const existingElection = await Election.findOne({ electionID });
        if (existingElection) {
            return res.status(409).json({ message: 'Election with this ID already exists.' });
        }

        // Create and save the election
        const election = new Election({
            title,
            description,
            electionID,
            startDate,
            endDate,
            candidates: [] // Initialize candidates array
        });

        const savedElection = await election.save();

        // Automatically add candidates to the Candidate model if provided
        if (candidates && candidates.length > 0) {
            const candidatePromises = candidates.map(candidateData => {
                const candidate = new Candidate({
                    name: candidateData.name,
                    electionId: savedElection._id, // Link candidate to this election
                    party: candidateData.party,
                    // Removed hashedId
                });
                return candidate.save(); // Return the promise for saving candidate
            });

            const savedCandidates = await Promise.all(candidatePromises);
            // Update election's candidates with saved candidate IDs
            savedElection.candidates = savedCandidates.map(candidate => candidate._id);
            await savedElection.save();
        }

        // Respond with the saved election and its candidates
        res.status(201).json({ election: savedElection, candidates });
    } catch (err) {
        console.error('Error creating election:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update an election
const updateElection = async (req, res) => {
    const { id } = req.params;
    const { title, description, candidates, startDate, endDate, electionID } = req.body;

    // Check if the ID is a valid ObjectId and electionID is provided
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid or missing election ID.' });
    }

    if (!electionID) {
        return res.status(400).json({ message: 'Election ID is required for updates.' });
    }

    try {
        // Update the election directly
        const updatedElection = await Election.findByIdAndUpdate(
            id,
            { title, description, startDate, endDate, electionID },
            { new: true, runValidators: true } // Returns updated document
        );

        if (!updatedElection) return res.status(404).json({ message: 'Election not found.' });

        // Optionally, update candidates if provided
        if (candidates && candidates.length > 0) {
            // Delete existing candidates for this election
            await Candidate.deleteMany({ electionId: id });

            // Add new candidates
            const candidatePromises = candidates.map(candidateData => {
                const candidate = new Candidate({
                    name: candidateData.name,
                    electionId: updatedElection._id,
                    party: candidateData.party,
                    // Removed hashedId
                });
                return candidate.save();
            });

            await Promise.all(candidatePromises);
        }

        res.json(updatedElection);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Delete an election
const deleteElection = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid election ID.' });
    }

    try {
        const result = await Election.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ message: 'Election not found.' });

        // Remove all candidates associated with this election
        const deleteResult = await Candidate.deleteMany({ electionId: id });
        console.log(`${deleteResult.deletedCount} candidates deleted.`);
        res.json({ message: 'Election and associated candidates deleted.' });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Get a single election by electionID
const getElectionById = async (req, res) => {
    const { id } = req.params;

    try {
        const election = await Election.findOne({ electionID: id });
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        res.json(election);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

module.exports = {
    getAllElections,
    createNewElection,
    updateElection,
    deleteElection,
    getElectionById
};
