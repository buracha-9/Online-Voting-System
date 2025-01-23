import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/ElectionCard.css';

const ElectionCard = ({ election = {} }) => {
    const navigate = useNavigate();

    const endDate = election.endDate ? new Date(election.endDate).toLocaleDateString() : 'End date not available';

    const handleVote = () => {
        navigate(`/elections/${election._id}`);
    };

    return (
        <div className="election-card">
            <h2 className="election-title">{election.title || 'Election Name Not Available'}</h2>
            <p className="election-date">End Date: {endDate}</p>
            <button className="vote-button" onClick={handleVote}>
                Vote Now
            </button>
        </div>
    );
};

export default ElectionCard;
