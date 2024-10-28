const bcrypt = require('bcrypt');
const User = require('../model/Register');

// Get all users (e.g., voters or admins)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(204).json({ message: 'No users found.' });
        }
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Register a new user (e.g., voter or admin)
const registerUser = async (req, res) => {
    const { firstname, lastname, email, password, userID, role, dateRegistered } = req.body;

    // Log the request body for debugging
    console.log('Request body:', req.body);

    // Validate required fields
    if (!firstname || !lastname || !email || !password || !userID) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check for duplicate email or userID
        const duplicateEmail = await User.findOne({ email }).exec();
        const duplicateID = await User.findOne({ userID }).exec();
        if (duplicateEmail || duplicateID) {
            return res.status(409).json({ message: 'User with this email or ID already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const result = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            userID,
            role: role || 'Voter',  // Default to 'Voter' if role is not specified
            dateRegistered: dateRegistered || Date.now() // Default to current date if not provided
        });

        res.status(201).json(result); // Respond with the created user
    } catch (err) {
        console.error("Registration Error:", err.message);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
};

// Update an existing user's details
const updateUser = async (req, res) => {
    const { id } = req.params; // Get id from URL params

    // Validate the ID
    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        // Find the user by ID
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).json({ message: `No user matches ID ${id}.` });
        }

        // Update the user's details if provided
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.email) user.email = req.body.email;
        if (req.body.role) user.role = req.body.role;
        if (req.body.dateRegistered) user.dateRegistered = req.body.dateRegistered;

        const result = await user.save();
        res.json(result); // Respond with the updated user
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a user from the system
const deleteUser = async (req, res) => {
    const { id } = req.params; // Get id from URL params

    // Validate the ID
    if (!id) return res.status(400).json({ message: 'User ID required.' });

    try {
        // Find and delete the user by ID
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).json({ message: `No user matches ID ${id}.` });
        }

        const result = await user.deleteOne();
        res.json(result); // Respond with the deleted user info
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a specific user by ID
const getUser = async (req, res) => {
    const { id } = req.params; // Get id from URL params

    // Validate the ID
    if (!id) return res.status(400).json({ message: 'User ID required.' });

    try {
        // Find the user by ID
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).json({ message: `No user matches ID ${id}.` });
        }
        res.json(user); // Respond with the user info
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getAllUsers,
    registerUser,
    updateUser,
    deleteUser,
    getUser
};
