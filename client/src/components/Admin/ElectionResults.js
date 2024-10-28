import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ElectionResults = () => {
    const { electionID } = useParams(); // Extract electionID from URL
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true); // Set loading to true when request starts
                const token = localStorage.getItem('token');
                const { data } = await axios.post(
                    `http://localhost:3500/votes/results/${electionID}`,
                    {}, // Empty body for POST request if not required
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (data && data.results) {
                    setResults(data.results);
                } else {
                    setError('No results available.');
                }
            } catch (error) {
                console.error('Error fetching results:', error.response ? error.response.data : error.message);
                setError('Failed to fetch results. Please try again later.');
            } finally {
                setLoading(false); // Set loading to false once request completes
            }
        };
        fetchResults();
    }, [electionID]); // Use electionID in the dependency array

    if (loading) {
        return <p>Loading election details...</p>; // Display loading message
    }

    return (
        <div>
            <h1>Election Results</h1>
            {error && <p className="error">{error}</p>}
            {results.length > 0 ? (
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>
                            <strong>Nominee:</strong> {result.nominee} - <strong>Votes:</strong> {result.votes || 0}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results available.</p>
            )}
        </div>
    );
};

export default ElectionResults;
