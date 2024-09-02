const AuditLog = require('../model/AuditLog');

const auditLogger = (action, resource) => {
    return async (req, res, next) => {
        try {
            const auditLog = new AuditLog({
                userId: req.user.id, // Assuming `req.user` contains the authenticated user
                action,
                resource,
                details: JSON.stringify(req.body) // Log the request body or any other relevant details
            });

            await auditLog.save();
            next();
        } catch (err) {
            console.error('Failed to log audit data', err);
            next(); // Proceed even if logging fails
        }
    };
};

module.exports = auditLogger;
