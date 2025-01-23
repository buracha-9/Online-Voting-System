const crypto = require('crypto');
const mongoose = require('mongoose');
const Vote = require('../model/Vote');
const Election = require('../model/Election');
const Nominee = require('../model/Nominee'); // Changed Candidate to Nominee

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
    const { electionID, nomineeId } = req.body;
    const { userId } = req.user;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    if (!electionID || !nomineeId) {
        return res.status(400).json({ message: 'Election ID and nominee ID are required.' });
    }

    try {
        const election = await Election.findById(electionID);
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        const now = new Date();
        if (now < election.startDate) {
            return res.status(403).json({ message: 'Election has not started yet.' });
        }
        if (now > election.endDate) {
            return res.status(403).json({ message: 'Election deadline has passed. Voting is no longer allowed.' });
        }

        const nominee = await Nominee.findById(nomineeId);
        if (!nominee) return res.status(404).json({ message: 'Nominee not found.' });

        // Check if the user has already voted in this election
        const existingVote = await Vote.findOne({ electionID, userId });
        if (existingVote) return res.status(403).json({ message: 'You have already voted in this election.' });

        const encryptedNomineeId = encrypt(nomineeId.toString());

        const vote = new Vote({
            electionID,
            nomineeId: encryptedNomineeId,
            voteDate: now,
            userId,
        });

        await vote.save();

        // Increment the total votes for the nominee
        await Nominee.findByIdAndUpdate(nomineeId, { $inc: { totalVotes: 1 } }, { new: true });

        res.status(201).json({ message: 'Vote cast successfully.' });
    } catch (err) {
        console.error('Error casting vote:', err);
        res.sendStatus(500);
    }
};

// Count votes
const countVotes = async (electionID) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(electionID)) {
            throw new Error('Invalid election ID');
        }

        const voteCounts = await Vote.aggregate([
            { $match: { electionID: new mongoose.Types.ObjectId(electionID) } }, // Ensure it is `electionID` not `electionId`
            { $group: { _id: "$nomineeId", count: { $sum: 1 } } } // Ensure you group by the correct field name
        ]);        

        console.log('Vote Counts:', voteCounts); // Check what is being returned

        return voteCounts.map(({ _id, count }) => {
            try {
                const nomineeId = decrypt(_id.toString()); // Ensure _id is converted to string if needed
                return {
                    nomineeId,
                    votes: count
                };
            } catch (decryptionError) {
                console.error(`Decryption error for nominee ID ${_id}:`, decryptionError);
                return { nomineeId: null, votes: count };
            }
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

        const nomineeVotes = {}; // Changed candidateVotes to nomineeVotes
        for (const { nomineeId, votes } of voteCounts) { // Updated to nomineeId
            if (nomineeId) {
                nomineeVotes[nomineeId] = (nomineeVotes[nomineeId] || 0) + votes; // Updated to nomineeVotes
            }
        }

        console.log('Nominee Votes:', nomineeVotes); // Check nominee votes

        const nominees = await Nominee.find({ _id: { $in: Object.keys(nomineeVotes) } }).lean(); // Updated to Nominee

        console.log('Nominees Found:', nominees); // Check nominees found

        const results = nominees.map(nominee => ({
            nominee: nominee.name, // Changed candidate to nominee
            votes: nomineeVotes[nominee._id.toString()] || 0 // Updated to nomineeVotes
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
