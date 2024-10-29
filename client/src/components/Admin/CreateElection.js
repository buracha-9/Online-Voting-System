import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import axios from 'axios';

const CreateElection = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [nominees, setNominees] = useState([{ name: '', nominatedWork: '' }]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // New state for success message
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleNomineeChange = (index, event) => {
        const newNominees = [...nominees];
        newNominees[index][event.target.name] = event.target.value;
        setNominees(newNominees);
    };

    const handleAddNominee = () => {
        setNominees([...nominees, { name: '', nominatedWork: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage(''); // Clear success message
        setLoading(true);

        // Validate date input
        if (new Date(startDate) >= new Date(endDate)) {
            setErrorMessage('Start date must be before end date.');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');

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

            // Clear form fields
            setTitle('');
            setDescription('');
            setStartDate('');
            setEndDate('');
            setNominees([{ name: '', nominatedWork: '' }]);
            
            // Set success message
            setSuccessMessage('Election created successfully!');
            
            // Delay navigation for 3 seconds
            setTimeout(() => {
                navigate('/admin');
            }, 3000); // 3000 ms = 3 seconds

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
            setLoading(false);
        }
    };

    return (
        <div className="create-election-container">
            <Link to="/login" className="login-link">Login</Link> {/* Login link at the top */}
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
                            name="nominatedWork"
                            value={nominee.nominatedWork}
                            onChange={(e) => handleNomineeChange(index, e)}
                            placeholder="Nominee Work"
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
