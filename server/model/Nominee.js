const mongoose = require('mongoose'); 

const nomineeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    nominatedWork: { // Add this field if you want to use it
        type: String, 
        required: true
    },
    electionId: { // Referencing the Election directly
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Election',
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

// Optional virtual to calculate nominee rank based on votes
nomineeSchema.virtual('rank').get(function() {
    if (this.totalVotes > 100) {
        return 'Top'; // Nominees with more than 100 votes are 'Top'
    }
    return 'Regular'; // Default rank for others
});

// Method to increment totalVotes
nomineeSchema.methods.incrementVotes = function() {
    this.totalVotes += 1; // Increments the vote count by 1
    return this.save(); // Saves the updated nominee document
};

// Method to add an award to the nominee
nomineeSchema.methods.addAward = function(award) {
    this.awards.push(award); // Adds the specified award to the awards array
    return this.save(); // Saves the updated nominee document
};

module.exports = mongoose.model('Nominee', nomineeSchema); // Export as 'Nominee'
