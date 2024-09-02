const AuditLog = require('../model/AuditLog');
const Employee = require('../model/Employee'); // Or User model if you have both employees and other users

// View audit logs
const viewAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().populate('userId', 'username').sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve audit logs' });
    }
};

// Update system configuration
const updateConfig = async (req, res) => {
    const { key, value } = req.body;

    try {
        const config = await Config.findOneAndUpdate(
            { key },
            { $set: { value } },
            { new: true, upsert: true }
        );

        res.json({ message: `Configuration for ${key} updated successfully.`, config });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update configuration' });
    }
};

// Get all users (including non-employee users if applicable)
const getAllUsers = async (req, res) => {
    try {
        const users = await Employee.find().select('-password'); // Exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve users' });
    }
};

const getSystemStats = async (req, res) => {
    try {
        // Total number of users
        const userCount = await Employee.countDocuments(); 

        // Number of active users in the last 30 days
        const activeUsers = await Employee.countDocuments({
            lastLogin: { $gte: new Date(Date.now() - 30*24*60*60*1000) }
        });

        // Number of administrators
        const adminCount = await Employee.countDocuments({ roles: 'Admin' });

        // Number of employees by department
        const departmentStats = await Employee.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);

        // Number of users registered in the last 7 days
        const newUsersLastWeek = await Employee.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
        });

        // Total number of votes cast (assuming a Vote model exists)
        const totalVotes = await Vote.countDocuments();

        // Returning the statistics
        res.json({
            userCount,
            activeUsers,
            adminCount,
            departmentStats,
            newUsersLastWeek,
            totalVotes
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve system statistics' });
    }
};


module.exports = {
    viewAuditLogs,
    updateConfig,
    getAllUsers,
    getSystemStats // Optional, include only if needed
};
