const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
    party: String,
    votes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Candidate', candidateSchema);
