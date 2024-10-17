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
        res.sendStatus(500);
    }
};

//create new election
const createNewElection = async (req, res) => {
    const { title, description, nominees, startDate, endDate } = req.body;

    if (!title || !startDate || !endDate) {
        return res.status(400).json({ message: 'Title, start date, and end date are required.' });
    }

    try {
        const existingElection = await Election.findOne({ title }); // Ensure title uniqueness
        if (existingElection) {
            return res.status(409).json({ message: 'Election with this title already exists.' });
        }
        // Assigning a unique electionID
        const electionID = `ELECTION-${Date.now()}`;

        const election = new Election({
            title,
            description,
            startDate,
            endDate,
            candidates: [],
            electionID
        });

        console.log('Creating election:', election); // Debugging log

        const savedElection = await election.save();

        // Automatically create candidates based on nominees provided
        if (nominees && nominees.length > 0) {
            const nomineePromises = nominees.map(nomineeData => {
                const nominee = new Candidate({
                    name: nomineeData.name,
                    electionId: savedElection._id, // Link the candidate to the election
                    category: nomineeData.category,
                });
                return nominee.save();
            });

            const savedNominees = await Promise.all(nomineePromises);
            savedElection.candidates = savedNominees.map(nominee => nominee._id); 
            await savedElection.save();
        }

        res.status(201).json({ election: savedElection });
    } catch (err) {
        console.error('Error creating election:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Update an election
const updateElection = async (req, res) => {
    const { id } = req.params;
    const { title, description, nominees, startDate, endDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid election ID.' });
    }

    try {
        const updatedElection = await Election.findByIdAndUpdate(
            id,
            { title, description, startDate, endDate },
            { new: true, runValidators: true }
        );

        if (!updatedElection) return res.status(404).json({ message: 'Election not found.' });

        if (nominees && nominees.length > 0) {
            await Candidate.deleteMany({ electionId: id });
            const nomineePromises = nominees.map(nomineeData => {
                const nominee = new Candidate({
                    name: nomineeData.name,
                    electionId: updatedElection._id,
                    category: nomineeData.category,
                });
                return nominee.save();
            });
            await Promise.all(nomineePromises);
        }

        res.json(updatedElection);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

// Delete an election
const deleteElection = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid election ID.' });
    }

    try {
        const result = await Election.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ message: 'Election not found.' });

        const deleteResult = await Candidate.deleteMany({ electionId: id });
        console.log(`${deleteResult.deletedCount} candidates deleted.`);
        res.json({ message: 'Election and associated candidates deleted.' });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

// Get a single election by ID
const getElectionById = async (req, res) => {
    const { id } = req.params;

    try {
        const election = await Election.findById(id); // Get by ID directly
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        res.json(election);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

module.exports = {
    getAllElections,
    createNewElection,
    updateElection,
    deleteElection,
    getElectionById,
};
