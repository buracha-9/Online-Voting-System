const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    electionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Election', 
        required: true 
    },
    candidateId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Candidate',
        required: true 
    },
    voteDate: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Unique index to ensure one vote per voter for a candidate in a specific election
voteSchema.index({ electionId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
