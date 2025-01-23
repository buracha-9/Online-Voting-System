import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ElectionCard from './ElectionCard';
import '../Styles/Elections.css';

const Elections = () => {
    const [availableElections, setAvailableElections] = useState([]);
    const [previousElections, setPreviousElections] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchElections = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:3500/elections', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const now = new Date();
                const available = response.data.filter(
                    (election) => new Date(election.endDate) > now
                );
                const previous = response.data.filter(
                    (election) => new Date(election.endDate) <= now
                );

                setAvailableElections(available);
                setPreviousElections(previous);
            } catch (error) {
                console.error('Error fetching elections:', error.response ? error.response.data : error.message);
                if (error.response && error.response.status === 403) {
                    setError('Access denied. Please log in again.'); // Clear message for access issues
                    navigate('/login');
                } else {
                    setError('Unable to retrieve elections. Please check your connection and try again.'); // General error message
                }
            }
        };
        
        fetchElections();
    }, [navigate]);

    return (
        <div className="elections-container">
            <h1>Available Elections</h1>
            {error && <p className="error">{error}</p>}
            <div className="elections-list">
                {availableElections.length > 0 ? (
                    availableElections.map((election) => (
                        <ElectionCard key={election._id} election={election} />
                    ))
                ) : (
                    <p className="no-elections">Currently, there are no available elections.</p>
                )}
            </div>

            <h2 className="prev">Previous Elections</h2>
            <div className="elections-list">
                {previousElections.length > 0 ? (
                    previousElections.map((election) => (
                        <ElectionCard key={election._id} election={election} />
                    ))
                ) : (
                    <p className="no-elections">There are no previous elections to display.</p>
                )}
            </div>
        </div>
    );
};

export default Elections;
