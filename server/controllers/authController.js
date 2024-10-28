const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/Register'); // Change Employee to User

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const { _id: userId, roles } = user;

        const accessToken = jwt.sign(
            { 
                UserInfo: { 
                    userId,  
                    email, 
                    roles 
                } 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId },  
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('jwt', refreshToken, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'None', 
            maxAge: 24 * 60 * 60 * 1000 
        });

        // Return both the token and role in the response
        res.status(200).json({ accessToken, role: roles[0] }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
};

module.exports = { login };
