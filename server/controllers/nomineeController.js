const Nominee = require('../model/Nominee'); // Updated to Nominee

// Update a nominee
const updateNominee = async (req, res) => {
    const { id } = req.params;
    const { name, awardEventId } = req.body; // Keep this consistent

    try {
        const nominee = await Nominee.findById(id);
        if (!nominee) return res.status(404).json({ message: 'Nominee not found.' });

        if (name) nominee.name = name;
        if (awardEventId) nominee.awardEventId = awardEventId;

        const result = await nominee.save();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Remove a nominee
const removeNominee = async (req, res) => {
    const { id } = req.params;

    try {
        const nominee = await Nominee.findById(id);
        if (!nominee) return res.status(404).json({ message: 'Nominee not found.' });

        await nominee.remove();
        res.json({ message: 'Nominee removed.' });
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// List nominees for an award event
const listNominees = async (req, res) => {
    const { awardEventId } = req.params; // Ensure this is consistent with your routes

    try {
        const nominees = await Nominee.find({ awardEventId });
        if (!nominees.length) return res.status(204).json({ message: 'No nominees found for this award event.' });
        res.json(nominees);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

// Get a nominee by ID
const getNomineeById = async (req, res) => {
    const { id } = req.params;

    try {
        const nominee = await Nominee.findById(id);
        if (!nominee) return res.status(404).json({ message: 'Nominee not found.' });
        res.json(nominee);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

module.exports = {
    updateNominee,
    removeNominee,
    listNominees,
    getNomineeById
};
