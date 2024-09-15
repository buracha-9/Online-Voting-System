const bcrypt = require('bcrypt');
const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees || employees.length === 0) {
        return res.status(204).json({ 'message': 'No employees found.' });
    }
    res.json(employees);
}

const createNewEmployee = async (req, res) => {
    const { firstname, lastname, email, password, employeeID, department, roles, dateJoined } = req.body;

    if (!firstname || !lastname || !email || !password || !employeeID || !department) {
        return res.status(400).json({ 'message': 'All fields are required.' });
    }

    // Check for duplicate email or employeeID
    const duplicateEmail = await Employee.findOne({ email }).exec();
    const duplicateID = await Employee.findOne({ employeeID }).exec();
    if (duplicateEmail || duplicateID) {
        return res.status(409).json({ 'message': 'Employee with this email or ID already exists.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await Employee.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            employeeID,
            department,
            roles: roles || ['Voter'],
            dateJoined: dateJoined || Date.now() // Use provided date or default to now
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': err.message });
    }
}

const updateEmployee = async (req, res) => {
    const { id } = req.params;  // Get id from URL params

    if (!id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: id }).exec();
    if (!employee) {
        return res.status(404).json({ "message": `No employee matches ID ${id}.` });
    }

    // Update the employee fields if they are provided
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    if (req.body?.email) employee.email = req.body.email;
    if (req.body?.department) employee.department = req.body.department;
    if (req.body?.roles) employee.roles = req.body.roles;
    if (req.body?.dateJoined) employee.dateJoined = req.body.dateJoined;

    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    const { id } = req.params;  // Get id from URL params

    if (!id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: id }).exec();
    if (!employee) {
        return res.status(404).json({ "message": `No employee matches ID ${id}.` });
    }

    const result = await employee.deleteOne();
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}
