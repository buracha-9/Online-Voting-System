const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    electionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Election', 
        required: true 
    },
    party: { 
        type: String, 
        default: '' 
    },
    votes: { 
        type: Number, 
        default: 0 
    }
}, {
    timestamps: true // Automatically handles createdAt and updatedAt fields
});

module.exports = mongoose.model('Candidate', candidateSchema);
