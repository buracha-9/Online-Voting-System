const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    electionID: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Election', 
        required: true 
    },
    nomineeId: {  // Store the encrypted nominee ID
        type: String,  
        required: true 
    },
    userId: {  // Track who cast the vote using userId from the token
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a User model
        required: true
    },
    voteDate: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Unique index to ensure one vote per user for a nominee in a specific election
voteSchema.index({ electionID: 1, nomineeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
