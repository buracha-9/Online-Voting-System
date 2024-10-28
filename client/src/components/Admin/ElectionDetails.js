import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ElectionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [election, setElection] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchElectionDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3500/elections/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setElection(response.data);
            } catch (err) {
                setErrorMessage('Failed to fetch election details.');
            } finally {
                setLoading(false);
            }
        };
        fetchElectionDetails();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this election?');
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3500/elections/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                navigate('/admin'); // Redirect to admin dashboard after deletion
            } catch (err) {
                setErrorMessage('Failed to delete the election.');
            }
        }
    };

    if (loading) {
        return <p>Loading election details...</p>;
    }

    if (errorMessage) {
        return <p className="error">{errorMessage}</p>;
    }

    return (
        <div className="election-details-container">
            <h2>{election.title}</h2>
            <p><strong>Description:</strong> {election.description}</p>
            <p><strong>Start Date:</strong> {new Date(election.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(election.endDate).toLocaleDateString()}</p>
            <h3>Nominees</h3>
            <ul>
                {election.nominees && election.nominees.length > 0 ? (
                    election.nominees.map((nominee) => (
                        <li key={nominee._id}>
                            <p><strong>Name:</strong> {nominee.name}</p>
                            <p><strong>Category:</strong> {nominee.category}</p> 
                        </li>
                    ))
                ) : (
                    <p>No nominees available for this election.</p>
                )}
            </ul>
            <button onClick={handleDelete}>Delete Election</button>
        </div>
    );
};

export default ElectionDetails;
