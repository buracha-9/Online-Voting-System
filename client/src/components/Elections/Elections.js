import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ElectionCard from './ElectionCard'; // Import the ElectionCard component

const Elections = () => {
    const [elections, setElections] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token
                const response = await axios.get('http://localhost:3500/elections', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the header
                    },
                });
                setElections(response.data);
            } catch (error) {
                console.error('Error fetching elections:', error.response ? error.response.data : error.message);
                setError('Failed to fetch elections. Please try again later.');
            }
        };

        fetchElections();
    }, []);

    return (
        <div>
            <h1>Available Elections</h1>
            {error && <p className="error">{error}</p>}
            <div className="elections-list">
                {elections.map((election) => (
                    <ElectionCard key={election._id} election={election} />
                ))}
            </div>
        </div>
    );
};

export default Elections;
