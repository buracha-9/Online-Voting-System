import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ElectionCard from './ElectionCard'; // Import the ElectionCard component
import { useNavigate } from 'react-router-dom';

const Elections = () => {
    const [currentElections, setCurrentElections] = useState([]);
    const [previousElections, setPreviousElections] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchElections = async () => {
            const token = localStorage.getItem('token'); // Retrieve the token
            if (!token) {
                navigate('/login'); // Redirect to login if no token is found
                return; // Exit the function early
            }

            try {
                const response = await axios.get('http://localhost:3500/elections', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the header
                    },
                });

                const currentDate = new Date();

                // Filter current elections
                const availableElections = response.data.filter(election => new Date(election.endDate) > currentDate);
                setCurrentElections(availableElections);

                // Filter previous elections
                const pastElections = response.data.filter(election => new Date(election.endDate) <= currentDate);
                // Sort past elections by end date in descending order and get the most recent 5
                const sortedPastElections = pastElections.sort((a, b) => new Date(b.endDate) - new Date(a.endDate)).slice(0, 5);
                setPreviousElections(sortedPastElections);
            } catch (error) {
                console.error('Error fetching elections:', error.response ? error.response.data : error.message);
                setError('Failed to fetch elections. Please try again later.');
            }
        };

        fetchElections();
    }, [navigate]); // Add navigate to the dependency array

    return (
        <div>
            <h1>Available Elections</h1>
            {error && <p className="error">{error}</p>}
            <h2>Current Elections</h2>
            <div className="elections-list">
                {currentElections.length > 0 ? (
                    currentElections.map((election) => (
                        <ElectionCard key={election._id} election={election} />
                    ))
                ) : (
                    <p>No current elections available.</p>
                )}
            </div>

            <h2>Previous Elections</h2>
            <div className="previous-elections-list">
                {previousElections.length > 0 ? (
                    previousElections.map((election) => (
                        <ElectionCard key={election._id} election={election} />
                    ))
                ) : (
                    <p>No previous elections available.</p>
                )}
            </div>
        </div>
    );
};

export default Elections;
