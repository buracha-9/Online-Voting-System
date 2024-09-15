const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const electionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    electionID: {
        type: String,
        unique: true,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    results: [{
        candidate: {
            type: String
        },
        votes: {
            type: Number
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Election', electionSchema);
