const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.sendStatus(401);

    // Extract the token
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); // Invalid token

        // Attach the decoded user information to the request object
        req.user = decoded.UserInfo; // Adjust this based on your token payload
        next();
    });
}

module.exports = verifyJWT;
