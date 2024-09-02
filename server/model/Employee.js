const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        enum: ['Admin', 'Voter', 'Candidate'],
        default: ['Voter']
    },
    employeeID: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    refreshToken: String
});

module.exports = mongoose.model('Employee', employeeSchema);
