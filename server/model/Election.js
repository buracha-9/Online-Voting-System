const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const electionSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    electionID: { 
        type: String, 
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return !this.endDate || this.endDate > value;
            },
            message: 'Start date must be before end date.'
        }
    },
    endDate: {
        type: Date,
        required: true
    },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    }],
    results: [{
        candidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate'
        },
        votes: {
            type: Number,
            default: 0
        },
        percentage: {
            type: Number,
            default: 0
        }
    }],
}, {
    timestamps: true
});

// Middleware to set a default electionID if not provided
electionSchema.pre('save', function(next) {
    if (!this.electionID) {
        this.electionID = `ELEC-${Date.now()}`;
    }
    next();
});

module.exports = mongoose.model('Election', electionSchema);
