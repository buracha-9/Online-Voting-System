const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employee = require('../model/Register'); 

const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find the employee by email
        const employee = await Employee.findOne({ email }).exec(); 
        if (!employee) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the password with the stored hash
        const match = await bcrypt.compare(password, employee.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Prepare the user information for the JWT payload
        const { _id: userId, roles } = employee;  // Destructure userId and roles

        // Generate the access token with userId and roles (no voterId)
        const accessToken = jwt.sign(
            { 
                UserInfo: { 
                    userId,  // Include userId in the payload
                    email, 
                    roles 
                } 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        // Generate the refresh token
        const refreshToken = jwt.sign(
            { userId },  // Use userId for refresh token
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Save the refresh token to the employee record
        employee.refreshToken = refreshToken;
        await employee.save();

        // Set the refresh token in an HTTP-only cookie
        res.cookie('jwt', refreshToken, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'None', 
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Send the access token as a response
        res.status(200).json({ accessToken });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
};

module.exports = { login };
