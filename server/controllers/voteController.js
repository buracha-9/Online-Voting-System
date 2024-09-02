const crypto = require('crypto');
const Vote = require('../model/Vote');
const Election = require('../model/Election');
const Candidate = require('../model/Candidate');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32-byte key for AES-256-CBC
const IV_LENGTH = 16; // For AES, this is always 16 bytes

const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

// Cast a vote
const castVote = async (req, res) => {
    const { electionId, candidateId } = req.body;
    const { userId } = req.user;

    if (!electionId || !candidateId) {
        return res.status(400).json({ message: 'Election ID and candidate ID are required.' });
    }

    try {
        const election = await Election.findById(electionId);
        if (!election) return res.status(404).json({ message: 'Election not found.' });

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });

        const existingVote = await Vote.findOne({ electionId, voterId: userId });
        if (existingVote) return res.status(403).json({ message: 'You have already voted in this election.' });

        const encryptedCandidateId = encrypt(candidateId.toString());

        const vote = new Vote({
            electionId,
            candidateId: encryptedCandidateId,
            voterId: userId
        });

        await vote.save();

        candidate.votes = (candidate.votes || 0) + 1;
        await candidate.save();

        res.status(201).json({ message: 'Vote cast successfully.' });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Count votes for an election
const countVotes = async (electionId) => {
    try {
        const votes = await Vote.aggregate([
            { $match: { electionId: electionId } },
            { $group: { _id: '$candidateId', count: { $sum: 1 } } }
        ]);

        const results = await Promise.all(votes.map(async (vote) => {
            const candidateId = decrypt(vote._id);
            const candidate = await Candidate.findById(candidateId);
            return {
                candidate: candidate.name,
                votes: vote.count
            };
        }));

        return results;
    } catch (err) {
        console.error(err);
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

        election.results = results;
        await election.save();

        res.json({ message: 'Results calculated and saved successfully.', results });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
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
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    castVote,
    countVotes,
    calculateResults,
    getResults
};
