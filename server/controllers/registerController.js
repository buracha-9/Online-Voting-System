const bcrypt = require('bcrypt');
const Employee = require('../model/Employee'); // Adjust path to your Employee model

const registerEmployee = async (req, res) => {
    const { firstname, lastname, email, password, roles, employeeID, department } = req.body;

    // Check if all required fields are provided
    if (!firstname || !lastname || !email || !password || !employeeID || !department) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate email or employeeID
    const duplicateEmail = await Employee.findOne({ email }).exec();
    const duplicateID = await Employee.findOne({ employeeID }).exec();

    if (duplicateEmail || duplicateID) {
        return res.status(409).json({ message: 'Employee with this email or ID already exists' });
    }

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and store the new employee
        const newEmployee = await Employee.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            roles: roles || ['Voter'], // Default to 'Voter' if no roles provided
            employeeID,
            department,
        });

        res.status(201).json({ message: `Employee ${firstname} ${lastname} registered successfully` });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { registerEmployee };
