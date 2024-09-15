const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Employee = require('../model/Employee'); 

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

        // Prepare the roles and userId for the JWT payload
        const roles = employee.roles;
        const userId = employee._id;  // Use userId in the JWT token

        // Generate the access token with userId, email, and roles
        const accessToken = jwt.sign(
            { 
                "UserInfo": { 
                    "userId": userId,  // Include userId in the payload
                    "email": employee.email, 
                    "roles": roles 
                } 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        // Generate the refresh token
        const refreshToken = jwt.sign(
            { "userId": userId },  // Use userId for refresh token
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
            maxAge: 24 * 60 * 60 * 1000 
        });

        // Send the access token as a response
        res.json({ accessToken });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { login };
