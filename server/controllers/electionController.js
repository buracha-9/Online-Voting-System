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

    if (!title || !electionID || !startDate || !endDate) {
        return res.status(400).json({ message: 'Title, election ID, start date, and end date are required.' });
    }

    try {
        // Check if the electionID already exists
        const existingElection = await Election.findOne({ electionID });
        if (existingElection) {
            return res.status(409).json({ message: 'Election with this ID already exists.' });
        }

        const election = new Election({
            title,
            description,
            electionID,
            startDate,
            endDate
        });

        const savedElection = await election.save();

        // Automatically add candidates to the Candidate model if provided
        if (candidates && candidates.length > 0) {
            const candidatePromises = candidates.map(candidateData => {
                const candidate = new Candidate({
                    name: candidateData.name,
                    electionId: savedElection._id, // Link candidate to this election
                    party: candidateData.party,
                    candidateID: candidateData.candidateID
                });
                return candidate.save();
            });

            await Promise.all(candidatePromises);
        }

        res.status(201).json(savedElection);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Update an election
const updateElection = async (req, res) => {
    const { id } = req.params; // Assuming the route parameter is `:id`
    const { title, description, candidates, startDate, endDate, electionID } = req.body;

    try {
        const election = await Election.findById(id);
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        // Update fields if they are provided
        if (title) election.title = title;
        if (description) election.description = description;
        if (startDate) election.startDate = startDate;
        if (endDate) election.endDate = endDate;
        if (electionID) election.electionID = electionID;

        const updatedElection = await election.save();

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
                    candidateID: candidateData.candidateID
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
    const { id } = req.params; // Assuming the route parameter is `:id`

    try {
        // Find and delete the election by its ID
        const result = await Election.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Election not found.' });
        }

        // Remove all candidates associated with this election
        await Candidate.deleteMany({ electionId: id });

        res.json({ message: 'Election and associated candidates deleted.' });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Get a single election by electionID
const getElectionById = async (req, res) => {
    const { id } = req.params; // Assuming the route parameter is `:id`

    console.log(`Received electionID: ${id}`); // Log to verify

    try {
        // Find election by ID or custom field
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
