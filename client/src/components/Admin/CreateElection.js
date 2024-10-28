import { useState } from 'react';
import axios from 'axios';

const CreateElection = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [nominees, setNominees] = useState([{ name: '', category: '' }]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [loading, setLoading] = useState(false); // State for loading

    const handleNomineeChange = (index, event) => {
        const newNominees = [...nominees];
        newNominees[index][event.target.name] = event.target.value;
        setNominees(newNominees);
    };

    const handleAddNominee = () => {
        setNominees([...nominees, { name: '', category: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message
        setSuccessMessage(''); // Reset success message
        setLoading(true); // Start loading

        // Validate date input
        if (new Date(startDate) >= new Date(endDate)) {
            setErrorMessage('Start date must be before end date.');
            setLoading(false);
            return;
        }

        // Retrieve token from localStorage
        const token = localStorage.getItem('token'); // Use "token" as in Login component

        try {
            const response = await axios.post(
                'http://localhost:3500/elections',
                { title, description, startDate, endDate, nominees },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Election created:', response.data);
            setTitle('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setNominees([{ name: '', category: '' }]);
            setSuccessMessage('Election created successfully!'); // Set success message
        } catch (err) {
            console.error('Error creating election:', err);
            if (err.response) {
                if (err.response.status === 409) {
                    setErrorMessage('An election with this title already exists.');
                } else {
                    setErrorMessage(err.response.data.message || 'Error creating election. Please try again.');
                }
            } else {
                setErrorMessage('Error creating election. Please check your network connection.');
            }
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="create-election-container">
            <h2>Create New Election</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>} {/* Display success message */}
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Election Title"
                        required
                    />
                </div>
                <div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                    />
                </div>
                <div>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>

                <h4>Nominees</h4>
                {nominees.map((nominee, index) => (
                    <div key={index}>
                        <input
                            name="name"
                            value={nominee.name}
                            onChange={(e) => handleNomineeChange(index, e)}
                            placeholder="Nominee Name"
                            required
                        />
                        <input
                            name="category"
                            value={nominee.category}
                            onChange={(e) => handleNomineeChange(index, e)}
                            placeholder="Nominee Category"
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={handleAddNominee}>Add Nominee</button>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Election...' : 'Create Election'}
                </button>
            </form>
        </div>
    );
};

export default CreateElection;
