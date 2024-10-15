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
    const { electionID, candidateId } = req.body;
    const { userId } = req.user; // Ensure userId is attached properly

    if (!electionID || !candidateId || !userId) {
        return res.status(400).json({ message: 'Election ID, candidate ID, and user ID are required.' });
    }

    try {
        // Check if the election and candidate exist
        const election = await Election.findById(electionID);
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });

        const now = new Date();
        if (now < election.startDate || now > election.endDate) {
            return res.status(403).json({ message: 'Election is not currently active.' });
        }

        // Check if the user has already voted in this election
        const existingVote = await Vote.findOne({ electionID, userId });
        if (existingVote) return res.status(403).json({ message: 'You have already voted in this election.' });

        // Check if the user has already voted for another party in this election
        const partyVote = await Vote.findOne({ electionID, userId, 'candidate.partyId': { $ne: partyId } });
        if (partyVote) return res.status(403).json({ message: 'You can only vote for one party in this election.' });

        // Hash the candidate ID for storage
        const hashedCandidateId = hashCandidateId(candidateId.toString());

        // Store the vote
        const vote = new Vote({
            electionID,
            candidateId: hashedCandidateId, // Store the hashed ID
            voteDate: new Date(),
            userId, // Store the user ID to track who voted
            partyId // Store the party ID to prevent multiple party votes
        });

        await vote.save();

        // Update total votes for the candidate
         await Candidate.findOneAndUpdate(
        { hashedId: hashedCandidateId },
        { $inc: { totalVotes: 1 } }
);

        res.status(201).json({ message: 'Vote cast successfully.' });
    } catch (err) {
        console.error('Error casting vote:', err);
        res.sendStatus(500);
    }
};

// Count votes for an election
const countVotes = async (electionID) => {
    try {
        console.log(`Counting votes for electionId: ${electionID}`);

        if (!mongoose.Types.ObjectId.isValid(electionID)) {
            throw new Error('Invalid electionId format');
        }
        const objectId = new mongoose.Types.ObjectId(electionID);

        const votes = await Vote.aggregate([
            { $match: { electionID: objectId } },
            { $group: { _id: '$candidateId', count: { $sum: 1 } } }
        ]);

        console.log('Votes:', votes);

        // Find candidates corresponding to the hashed candidate IDs
        const results = await Promise.all(votes.map(async (vote) => {
            const candidate = await Candidate.findOne({ hashedId: vote._id }).lean();
            return {
                candidate: candidate ? candidate.name : `Candidate with ID ${vote._id} not found`,
                votes: vote.count
            };
        }));

        console.log('Results:', results);
        return results;
    } catch (err) {
        console.error('Error in countVotes:', err.message);
        throw new Error('Error counting votes');
    }
};

// Calculate results for an election
const calculateResults = async (req, res) => {
    const { id } = req.params; // Election ID

    try {
        // Find the election
        const election = await Election.findById(id);
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        // Aggregate votes for each candidate
        const voteCounts = await Vote.aggregate([
            { $match: { electionID: mongoose.Types.ObjectId(id) } },
            { $group: { _id: "$candidateId", count: { $sum: 1 } } }
        ]);

        // Find candidates
        const candidateIds = voteCounts.map(vote => vote._id);
        const candidates = await Candidate.find({ hashedId: { $in: candidateIds } }).lean();

        // Prepare results
        const results = voteCounts.map(voteCount => {
            const candidate = candidates.find(cand => cand.hashedId === voteCount._id);
            return {
                candidate: candidate ? candidate.name : `Candidate with ID ${voteCount._id} not found`,
                votes: voteCount.count
            };
        });

        // Save results to the election
        election.results = results;
        await election.save();

        res.json({ message: 'Results calculated and saved successfully.', results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error calculating results.' });
    }
};

const recordVote = async (electionID, candidateId) => {
    try {
        const election = await Election.findOne({ electionID }).populate('results.candidate');
        
        if (!election) throw new Error('Election not found');
        
        // Find the candidate in the results array and increment votes
        const candidateResult = election.results.find(result => result.candidate._id.equals(candidateId));
        if (!candidateResult) throw new Error('Candidate not found in election');

        candidateResult.votes += 1;

        // Update vote percentages for all candidates
        const totalVotes = election.results.reduce((acc, result) => acc + result.votes, 0);
        election.results.forEach(result => {
            result.percentage = totalVotes  ? (result.votes / totalVotes) * 100 : 0;
        });

        await election.save();
        return election;
    } catch (error) {
        console.error(error);
        throw new Error('Error recording vote');
    }
};

// Get results for an election
const getResults = async (req, res) => {
    const { electionID } = req.params;

    try {
        const election = await Election.findById(electionID);
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
    recordVote,
    getResults
};
