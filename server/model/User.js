const mongoose = require('mongoose');
const ROLES = require('../config/rolesList');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    roles: {
        type: [String],
        enum: [ROLES.ADMIN, ROLES.VOTER, ROLES.CANDIDATE],
        default: [ROLES.VOTER]
    },
    refreshToken: String,
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
