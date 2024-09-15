const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    electionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Election', 
        required: true 
    },
    candidateId: { 
        type: mongoose.Schema.Types.ObjectId, // Store hashed candidateId as an ObjectId
        ref: 'Candidate',
        required: true 
    },
    voterId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    voteDate: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Adding indexes for better performance
voteSchema.index({ electionId: 1, candidateId: 1, voterId: 1 });

module.exports = mongoose.model('Vote', voteSchema);
