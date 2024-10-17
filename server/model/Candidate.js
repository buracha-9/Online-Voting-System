const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const candidateSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    electionId: { // Referencing the Election directly
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Election', // Updated to reflect the Election context
        required: true 
    },
    totalVotes: {
        type: Number,
        default: 0,
        min: [0, 'Total votes cannot be negative.']
    },
    awards: { 
        type: [String], 
        default: [] 
    }
}, {
    timestamps: true 
});

// Optional virtual to calculate candidate rank based on votes
candidateSchema.virtual('rank').get(function() {
    if (this.totalVotes > 100) {
        return 'Top'; // Candidates with more than 100 votes are 'Top'
    }
    return 'Regular'; // Default rank for others
});

// Method to increment totalVotes
candidateSchema.methods.incrementVotes = function() {
    this.totalVotes += 1; // Increments the vote count by 1
    return this.save(); // Saves the updated candidate document
};

// Method to add an award to the candidate
candidateSchema.methods.addAward = function(award) {
    this.awards.push(award); // Adds the specified award to the awards array
    return this.save(); // Saves the updated candidate document
};

module.exports = mongoose.model('Candidate', candidateSchema);
