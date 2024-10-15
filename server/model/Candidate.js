const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    electionID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Election', 
        required: true 
    },
    party: { 
        type: String, 
        default: 'Independent' 
    },
    totalVotes: { // New field to track votes for the candidate
        type: Number,
        default: 0,
        min: [0, 'Total votes cannot be negative.'] // Adding validation for non-negative votes
    }
}, {
    timestamps: true // Automatically handles createdAt and updatedAt fields
});

// Optional virtual to calculate candidate rank based on votes
candidateSchema.virtual('rank').get(function() {
    // Logic to calculate rank based on totalVotes
    if (this.totalVotes > 100) {
        return 'Top'; // Candidates with more than 100 votes are 'Top'
    }
    return 'Regular'; // Default rank for others
});

// Optional: Method to increment totalVotes
candidateSchema.methods.incrementVotes = function() {
    this.totalVotes += 1; // Increments the vote count by 1
    return this.save(); // Saves the updated candidate document
};

module.exports = mongoose.model('Candidate', candidateSchema);
