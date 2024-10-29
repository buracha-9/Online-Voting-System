const mongoose = require('mongoose');
const Election = require('../model/Election'); 
const Nominee = require('../model/Nominee'); // Updated import

// Get all elections
const getAllElections = async (req, res) => {
    try {
        const elections = await Election.find().populate('nominees'); // Populate nominees in each election
        if (!elections.length) {
            return res.status(204).json({ message: 'No elections found.' });
        }
        res.json(elections);
    } catch (err) {
        console.error('Error fetching elections:', err);
        res.sendStatus(500);
    }
};

// Create new election
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
            nominees: [], // Initially empty; nominees will be populated later
            electionID
        });

        console.log('Creating election:', election); // Debugging log

        const savedElection = await election.save();

        // Automatically create nominees based on nominees provided
        if (nominees && nominees.length > 0) {
            const nomineePromises = nominees.map(nomineeData => {
                const nominee = new Nominee({
                    name: nomineeData.name,
                    electionId: savedElection._id, // Link the nominee to the election
                    nominatedWork: nomineeData.nominatedWork // Ensure category is included
                });
                return nominee.save();
            });

            const savedNominees = await Promise.all(nomineePromises);
            savedElection.nominees = savedNominees.map(nominee => nominee._id); 
            await savedElection.save();
        }

        // Populate nominees for the response
        const populatedElection = await Election.findById(savedElection._id).populate('nominees');
        
        res.status(201).json({ election: populatedElection });
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
        // Update basic election details
        const updatedElection = await Election.findByIdAndUpdate(
            id,
            { title, description, startDate, endDate },
            { new: true, runValidators: true }
        );

        if (!updatedElection) return res.status(404).json({ message: 'Election not found.' });

        if (nominees && nominees.length > 0) {
            // Delete old nominees associated with this election
            await Nominee.deleteMany({ electionId: id });

            // Save new nominees
            const nomineePromises = nominees.map(async nomineeData => {
                const nominee = new Nominee({
                    name: nomineeData.name,
                    electionId: updatedElection._id,
                    nominatedWork: nomineeData.nominatedWork,
                });
                try {
                    return await nominee.save();
                } catch (error) {
                    console.error("Error saving nominee:", error);
                }
            });
            await Promise.all(nomineePromises);
        }

        // Retrieve the updated election with populated nominees
        const populatedElection = await Election.findById(updatedElection._id).populate('nominees');
        res.json(populatedElection);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
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

        const deleteResult = await Nominee.deleteMany({ electionId: id }); // Changed from Candidate to Nominee
        console.log(`${deleteResult.deletedCount} nominees deleted.`);
        res.json({ message: 'Election and associated nominees deleted.' });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

// Get a single election by ID
const getElectionById = async (req, res) => {
    const { id } = req.params;

    try {
        const election = await Election.findById(id).populate('nominees'); // Populate nominees
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
