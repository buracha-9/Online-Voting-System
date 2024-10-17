const crypto = require('crypto');
const mongoose = require('mongoose');
const Vote = require('../model/Vote');
const Election = require('../model/Election');
const Candidate = require('../model/Candidate');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes for AES-256
const IV_LENGTH = 16; // For AES, this is always 16 bytes

// Encrypt function
const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(ENCRYPTION_KEY, 'hex'); // Use 'hex' instead of 'utf-8'
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
        const key = Buffer.from(ENCRYPTION_KEY, 'hex'); // Use 'hex' instead of 'utf-8'
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        throw new Error('Decryption failed');
    }
};

// Cast a vote
const castVote = async (req, res) => {
    const { electionID, candidateId } = req.body;
    const { userId } = req.user;  // Get userId from the token

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    if (!electionID || !candidateId) {
        return res.status(400).json({ message: 'Election ID and candidate ID are required.' });
    }

    try {
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

        const encryptedCandidateId = encrypt(candidateId.toString());

        const vote = new Vote({
            electionID,
            candidateId: encryptedCandidateId,
            voteDate: new Date(),
            userId,  // Use userId instead of voterId
        });

        await vote.save();

        // Increment the total votes for the candidate
        await Candidate.findByIdAndUpdate(candidateId, { $inc: { totalVotes: 1 } }, { new: true });

        res.status(201).json({ message: 'Vote cast successfully.' });
    } catch (err) {
        console.error('Error casting vote:', err);
        res.sendStatus(500);
    }
};
//count votes
const countVotes = async (electionID) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(electionID)) {
            throw new Error('Invalid election ID');
        }

        const voteCounts = await Vote.aggregate([
            { $match: { electionId: new mongoose.Types.ObjectId(electionID) } },
            { $group: { _id: "$encryptedCandidateId", count: { $sum: 1 } } }
        ]);

        console.log('Vote Counts:', voteCounts); // Check what is being returned

        return voteCounts.map(({ _id, count }) => {
            try {
                const candidateId = decrypt(_id);
                return {
                    candidateId,
                    votes: count
                };
            } catch (decryptionError) {
                console.error(`Decryption error for candidate ID ${_id}:`, decryptionError);
                return { candidateId: null, votes: count }; // Handle decryption failure
            }
            console.log('Decrypted Candidate ID:', candidateId);
        });

    } catch (err) {
        console.error('Error counting votes:', err);
        throw new Error('Error counting votes');
    }
};

const calculateResults = async (req, res) => {
    const { electionID } = req.params;

    try {
        const election = await Election.findById(electionID);
        if (!election) {
            return res.status(404).json({ message: 'Election not found.' });
        }

        const voteCounts = await countVotes(electionID);
        console.log('Vote Counts Returned:', voteCounts); // Check what is returned from countVotes

        const candidateVotes = {};
        for (const { candidateId, votes } of voteCounts) {
            if (candidateId) {
                candidateVotes[candidateId] = (candidateVotes[candidateId] || 0) + votes;
            }
        }

        console.log('Candidate Votes:', candidateVotes); // Check candidate votes

        const candidates = await Candidate.find({ _id: { $in: Object.keys(candidateVotes) } }).lean();

        console.log('Candidates Found:', candidates); // Check candidates found

        const results = candidates.map(candidate => ({
            candidate: candidate.name,
            votes: candidateVotes[candidate._id.toString()] || 0
        }));

        console.log('Final Results:', results); // Check final results

        election.results = results;
        await election.save();

        res.json({ message: 'Results calculated successfully.', results });
    } catch (err) {
        console.error('Error calculating results:', err);
        res.status(500).json({ message: 'Error calculating results.' });
    }
};

// Get election results
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
    getResults
};
