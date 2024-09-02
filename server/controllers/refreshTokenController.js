const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    // Check if refresh token is in cookies
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized
    const refreshToken = cookies.jwt;

    try {
        // Find the user associated with the refresh token
        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) return res.sendStatus(403); // Forbidden

        // Verify the refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403); // Forbidden

            // Generate a new access token
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' } // Adjust token expiration as needed
            );

            // Respond with new access token and user roles
            res.json({ roles, accessToken });
        });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal Server Error
    }
};

module.exports = { handleRefreshToken };
