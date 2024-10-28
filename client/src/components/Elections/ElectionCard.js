import React from 'react';
import { useNavigate } from 'react-router-dom';

const ElectionCard = ({ election = {} }) => {
    const navigate = useNavigate(); // Hook to navigate between routes

    // Format end date or provide default message
    const endDate = election.endDate ? new Date(election.endDate).toLocaleDateString() : 'End date not available';

    // Navigate to election voting page
    const handleVote = () => {
        navigate(`/elections/${election._id}`); // Use election ID to navigate to voting page
    };

    return (
        <div className="election-card">
            <h2>{election.title || 'Election Name Not Available'}</h2>
            <p>End Date: {endDate}</p>
            <button onClick={handleVote}>Vote Now</button> {/* Updated function name */}
        </div>
    );
};

export default ElectionCard;
