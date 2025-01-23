import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFacebookF, FaTwitter, FaTelegramPlane, FaSnapchatGhost, FaInstagram, FaTiktok } from 'react-icons/fa';
import '../Styles/Voting.css';

const Voting = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [election, setElection] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [voteSuccess, setVoteSuccess] = useState('');
    const [voteError, setVoteError] = useState('');
    const [voting, setVoting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        if (id) {
            fetchElection(id, token);
        } else {
            setLoading(false);
        }
    }, [id, navigate]);

    const fetchElection = async (electionId, token) => {
        try {
            const { data } = await axios.get(`http://localhost:3500/elections/${electionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setElection(data);
        } catch (error) {
            setError('Failed to fetch election details. Please try again later.');
            console.error('Error fetching election details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (nomineeId) => {
        setVoteSuccess('');
        setVoteError('');
        setVoting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No valid token found. Please log in again.');
            await axios.post(
                `http://localhost:3500/votes`,
                { nomineeId, electionID: election._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVoteSuccess('Your vote has been cast successfully! Thank you for participating.');
        } catch (error) {
            setVoteError('Unable to cast your vote. Please try again later or contact support if the problem persists.');
            console.error('Error casting vote:', error);
        } finally {
            setVoting(false);
            fetchElection(election._id, localStorage.getItem('token'));
        }
    };

    const handleShare = (platform) => {
        const electionUrl = `http://localhost:3000/elections/${election._id}`;
        const shareText = `Check out this election: ${election.title}`;
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(electionUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(electionUrl)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(electionUrl)}&text=${encodeURIComponent(shareText)}`;
                break;
            case 'snapchat':
                shareUrl = `https://www.snapchat.com/add?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(electionUrl)}`;
                break;
            case 'instagram':
                shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(electionUrl)}`;
                break;
            case 'tiktok':
                shareUrl = `https://www.tiktok.com/share?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(electionUrl)}`;
                break;
            default:
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
    };

    if (loading) return <p>Loading election details...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="election-details-page">
            {election ? (
                <>
                    <h1>{election.title || 'Election Name Not Available'}</h1>
                    <h2>Nominees:</h2>
                    <ul className="nominee-list">
                        {election.nominees && election.nominees.length > 0 ? (
                            election.nominees.map((nominee) => (
                                <li key={nominee._id} className="nominee-item">
                                    <span>{nominee.name}</span>
                                    <button onClick={() => handleVote(nominee._id)} disabled={voting}>
                                        {voting ? 'Voting...' : 'Vote'}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p>No nominees available for this election.</p>
                        )}
                    </ul>
                    {voteSuccess && <p className="success">{voteSuccess}</p>}
                    {voteError && <p className="error">{voteError}</p>}

                    <h2>Share this Election</h2>
                    <div className="share-buttons">
                        <button className="share-button" onClick={() => handleShare('facebook')}>
                            <FaFacebookF />
                        </button>
                        <button className="share-button" onClick={() => handleShare('twitter')}>
                            <FaTwitter />
                        </button>
                        <button className="share-button" onClick={() => handleShare('telegram')}>
                            <FaTelegramPlane />
                        </button>
                        <button className="share-button" onClick={() => handleShare('snapchat')}>
                            <FaSnapchatGhost />
                        </button>
                        <button className="share-button" onClick={() => handleShare('instagram')}>
                            <FaInstagram />
                        </button>
                        <button className="share-button" onClick={() => handleShare('tiktok')}>
                            <FaTiktok />
                        </button>
                    </div>
                </>
            ) : (
                <p>Select an election to view its details.</p>
            )}
        </div>
    );
};

export default Voting;
