const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Extract Bearer token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token not provided or malformed' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        // Attach the decoded user info to the request
        req.user = { voterId: decoded.id }; // Assuming your JWT contains a field called 'id' for voterId
        next();
    });
};

module.exports = authMiddleware;
