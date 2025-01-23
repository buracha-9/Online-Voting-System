import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/ElectionDetails.css';

const ElectionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [election, setElection] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false); // State for delete confirmation

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
                setErrorMessage('Failed to fetch election details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchElectionDetails();
    }, [id]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3500/elections/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccessMessage('Election deleted successfully!'); // Success message on deletion
            setTimeout(() => {
                navigate('/admin'); // Redirect after a delay to show the message
            }, 2000);
        } catch (err) {
            setErrorMessage('Failed to delete the election. Please try again later.');
        }
    };

    const confirmDelete = () => {
        setShowConfirmDelete(true); // Show the confirmation dialog
    };

    const cancelDelete = () => {
        setShowConfirmDelete(false); // Close the confirmation dialog
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
                            <p><strong>Nominated Work:</strong> {nominee.nominatedWork}</p> 
                        </li>
                    ))
                ) : (
                    <p>No nominees available for this election.</p>
                )}
            </ul>
            <button onClick={confirmDelete}>Delete Election</button>

            {/* Confirmation Dialog */}
            {showConfirmDelete && (
                <div className="confirm-delete-dialog">
                    <p>Are you sure you want to delete this election? This action cannot be undone.</p>
                    <button onClick={handleDelete}>Yes, Delete</button>
                    <button onClick={cancelDelete}>Cancel</button>
                </div>
            )}

            {/* Success Message */}
            {successMessage && <p className="success">{successMessage}</p>}
        </div>
    );
};

export default ElectionDetails;
