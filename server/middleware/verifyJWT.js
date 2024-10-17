const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if Authorization header is present and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from the Bearer header

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        // Adjust this to match your token payload structure
        req.user = decoded.UserInfo; // Assuming `UserInfo` contains userId or other user-related data

        if (!req.user || !req.user.userId) { // No need for voterId, just check for userId
            return res.status(403).json({ message: 'Invalid token structure, user info missing' });
        }

        next();
    });
};

module.exports = verifyJWT;
