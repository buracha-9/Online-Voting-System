const ROLES = require('../config/rolesList');

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.user?.roles) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const rolesArray = [...allowedRoles];
        const result = req.user.roles.some(role => rolesArray.includes(role));

        if (!result) return res.status(403).json({ message: 'Forbidden' });
        next();
    }
}

module.exports = verifyRoles;
