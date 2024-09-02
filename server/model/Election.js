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
    candidates: [{
        name: {
            type: String,
            required: true
        },
        party: {
            type: String,
            default: ''
        }
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Election', electionSchema);
