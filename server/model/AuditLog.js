const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditLogSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true }, // The resource being accessed or modified
    timestamp: { type: Date, default: Date.now },
    details: { type: String } // Any additional details (e.g., changes made, sensitive data accessed)
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
