const User = require('../model/Register');

const handleLogout = async (req, res) => {
    // Retrieve the JWT from cookies
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content if no token is found

    const refreshToken = cookies.jwt;

    try {
        // Find the user associated with the refresh token
        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) {
            // If no user is found, clear the cookie and return
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204); // No content
        }

        // Remove the refresh token from the user's record
        foundUser.refreshToken = '';
        await foundUser.save();

        // Clear the cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

        // Respond with no content status
        res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error in case of exception
    }
};

module.exports = { handleLogout };
