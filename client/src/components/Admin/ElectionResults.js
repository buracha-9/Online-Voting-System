import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../Styles/ElectionResults.css';

const ElectionResults = () => {
    const { electionID } = useParams(); // Extract electionID from URL
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState('');
    const [noResultsMessage, setNoResultsMessage] = useState(''); // Message for no results

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

                // Check if results exist in the response
                if (data && data.results && data.results.length > 0) {
                    setResults(data.results);
                } else {
                    setNoResultsMessage('No results have been recorded for this election yet.'); // Clear message for no results
                }
            } catch (error) {
                console.error('Error fetching results:', error.response ? error.response.data : error.message);
                setError('Unable to fetch election results. Please try again later.'); // Clearer error message
            } finally {
                setLoading(false); // Set loading to false once request completes
            }
        };
        fetchResults();
    }, [electionID]); // Use electionID in the dependency array

    if (loading) {
        return <p>Loading election results, please wait...</p>; // More descriptive loading message
    }

    return (
        <div>
            <h1>Election Results</h1>
            {error && <p className="error">{error}</p>}
            {noResultsMessage && <p className="no-results">{noResultsMessage}</p>}
            {results.length > 0 ? (
                <ul>
                    {results.map((result, index) => (
                        <li key={index}>
                            <strong>Nominee:</strong> {result.nominee} - <strong>Votes:</strong> {result.votes || 0}
                        </li>
                    ))}
                </ul>
            ) : (
                !noResultsMessage && <p>No results available for this election.</p> // Fallback message
            )}
        </div>
    );
};

export default ElectionResults;
