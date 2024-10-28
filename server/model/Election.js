const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const electionSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true // Ensure unique titles for elections
    },
    description: {
        type: String,
        default: ''
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
    nominees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nominee'
    }],
    electionID: {
        type: String,
        required: true,
        unique: true // Ensure unique election IDs if added
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Election', electionSchema);
