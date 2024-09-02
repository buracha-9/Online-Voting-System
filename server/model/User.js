const mongoose = require('mongoose');
const ROLES = require('../config/rolesList');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
        type: [String],
        enum: [ROLES.ADMIN, ROLES.VOTER, ROLES.CANDIDATE],
        default: [ROLES.VOTER]
    },
    refreshToken: String,
});

// Check if the model already exists before defining it
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
