const Election = require('../model/Election');

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
    const { title, description, candidates, startDate, endDate } = req.body;

    if (!title || !startDate || !endDate) {
        return res.status(400).json({ message: 'Title, start date, and end date are required.' });
    }

    try {
        const election = new Election({
            title,
            description,
            candidates,
            startDate,
            endDate
        });

        const result = await election.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Update an election
const updateElection = async (req, res) => {
    const { id } = req.params;
    const { title, description, candidates, startDate, endDate } = req.body;

    try {
        const election = await Election.findById(id);
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        if (title) election.title = title;
        if (description) election.description = description;
        if (candidates) election.candidates = candidates;
        if (startDate) election.startDate = startDate;
        if (endDate) election.endDate = endDate;

        const result = await election.save();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Delete an election
const deleteElection = async (req, res) => {
    const { id } = req.params;

    try {
        const election = await Election.findById(id);
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        await election.remove();
        res.json({ message: 'Election deleted.' });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Get a single election by ID
const getElectionById = async (req, res) => {
    const { id } = req.params;

    try {
        const election = await Election.findById(id);
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
