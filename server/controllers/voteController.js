const crypto = require('crypto');
const mongoose = require('mongoose');
const Vote = require('../model/Vote');
const Election = require('../model/Election');
const Candidate = require('../model/Candidate');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Ensure this is 32 bytes for AES-256
const IV_LENGTH = 16; // For AES, this is always 16 bytes

// Encrypt function
const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(ENCRYPTION_KEY, 'utf-8');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// Decrypt function
const decrypt = (text) => {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const key = Buffer.from(ENCRYPTION_KEY, 'utf-8');
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        throw new Error('Decryption failed');
    }
};

// Hash function (for comparison and indexing performance)
const hashCandidateId = (candidateId) => {
    return crypto.createHash('sha256').update(candidateId).digest('hex');
};

// Cast a vote
const castVote = async (req, res) => {
    const { electionId, candidateId } = req.body;
    const { userId } = req.user;

    if (!electionId || !candidateId) {
        return res.status(400).json({ message: 'Election ID and candidate ID are required.' });
    }

    if (!userId) {
        console.error('User ID is undefined');
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });

        const existingVote = await Vote.findOne({ electionId, voterId: userId });
        if (existingVote) return res.status(403).json({ message: 'You have already voted in this election.' });

        // Hash candidateId for storage
        const hashedCandidateId = hashCandidateId(candidateId.toString());
        const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

        if (!isValidObjectId(candidateId)) {
            throw new Error('Invalid candidateId');
        }


        const vote = new Vote({
            electionId,
            candidateId: hashedCandidateId, // Store the hash
            voterId: userId
        });

        await vote.save();

        // Update candidate's vote count
        candidate.votes = (candidate.votes || 0) + 1;
        await candidate.save();

        res.status(201).json({ message: 'Vote cast successfully.' });
    } catch (err) {
        console.error('Error casting vote:', err);
        res.sendStatus(500);
    }
};

// Count votes for an election
/*const countVotes = async (electionId) => {
    try {
        console.log(`Counting votes for electionId: ${electionId}`);

        // Ensure electionId is a valid ObjectId instance
        if (!mongoose.Types.ObjectId.isValid(electionId)) {
            throw new Error('Invalid electionId format');
        }
        const objectId = new mongoose.Types.ObjectId(electionId);

        // Aggregate vote count by candidate ID
        const votes = await Vote.aggregate([
            { $match: { electionId: objectId } }, // Use the ObjectId instance
            { $group: { _id: '$candidateId', count: { $sum: 1 } } }
        ]);

        console.log('Votes:', votes);

        // Retrieve candidate names and vote counts
        const results = await Promise.all(votes.map(async (vote) => {
            // Find candidate using the candidateId directly
            const candidate = await Candidate.findById(vote._id).lean();
            return {
                candidate: candidate ? candidate.name : `Candidate with ID ${vote._id} not found`,
                votes: vote.count
            };
        }));

        console.log('Results:', results);
        return results;
    } catch (err) {
        console.error('Error in countVotes:', err.message); // Log error message
        throw new Error('Error counting votes');
    }
};*/

const countVotes = async (electionId) => {
    try {
        console.log(`Counting votes for electionId: ${electionId}`);

        // Ensure electionId is a valid ObjectId instance
        if (!mongoose.Types.ObjectId.isValid(electionId)) {
            throw new Error('Invalid electionId format');
        }
        const objectId = new mongoose.Types.ObjectId(electionId);

        // Aggregate vote count by candidate ID
        const votes = await Vote.aggregate([
            { $match: { electionId: objectId } }, // Use the ObjectId instance
            { $group: { _id: '$candidateId', count: { $sum: 1 } } }
        ]);

        console.log('Votes:', votes);

        // Retrieve candidate names and vote counts
        const results = await Promise.all(votes.map(async (vote) => {
            // Log the format of vote._id
            console.log(`Processing vote._id: ${vote._id}`);

            // Convert vote._id (candidateId) to ObjectId only if necessary
            let candidateId;
            if (mongoose.Types.ObjectId.isValid(vote._id)) {
                candidateId = new mongoose.Types.ObjectId(vote._id);
                console.log(`Converted candidateId: ${candidateId}`);
            } else {
                candidateId = vote._id;
                console.log(`Candidate ID is not a valid ObjectId: ${vote._id}`);
            }

            // Find candidate using the ObjectId-converted candidateId
            const candidate = await Candidate.findById(candidateId).lean();
            return {
                candidate: candidate ? candidate.name : `Candidate with ID ${vote._id} not found`,
                votes: vote.count
            };
        }));

        console.log('Results:', results);
        return results;
    } catch (err) {
        console.error('Error in countVotes:', err.message); // Log error message
        throw new Error('Error counting votes');
    }
};


// Calculate results for an election
const calculateResults = async (req, res) => {
    const { electionId } = req.params;

    try {
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        const results = await countVotes(electionId);

        // Save results to the election
        election.results = results;
        await election.save();

        res.json({ message: 'Results calculated and saved successfully.', results });
    } catch (err) {
        console.error('Error calculating results:', err);
        res.sendStatus(500);
    }
};


// Get results for an election
const getResults = async (req, res) => {
    const { electionId } = req.params;

    try {
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        if (!election.results || election.results.length === 0) {
            return res.status(404).json({ message: 'Results not yet calculated.' });
        }

        res.json({ results: election.results });
    } catch (err) {
        console.error('Error getting results:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    castVote,
    countVotes,
    calculateResults,
    getResults
};
