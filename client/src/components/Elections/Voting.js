import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Voting = () => {
    const { id } = useParams();
    const [election, setElection] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [voteSuccess, setVoteSuccess] = useState('');
    const [voteError, setVoteError] = useState('');
    const [voting, setVoting] = useState(false);

    useEffect(() => {
        if (id) {
            fetchElection(id);
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchElection = async (electionId) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`http://localhost:3500/elections/${electionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setElection(data);
        } catch (error) {
            console.error('Error fetching election details:', error.response ? error.response.data : error.message);
            setError('Failed to fetch election details. Please try again later.');
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
            setVoteSuccess(`Vote Cast successfully`);
        } catch (error) {
            console.error('Error casting vote:', error.response ? error.response.data : error.message);
            setVoteError('Failed to cast vote. Please try again later.');
        } finally {
            setVoting(false);
            // Fetch updated nominees after voting
            fetchElection(election._id);
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
            case 'x':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(electionUrl)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(electionUrl)}&text=${encodeURIComponent(shareText)}`;
                break;
            case 'snapchat':
                shareUrl = `https://snapchat.com/share?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(electionUrl)}`;
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
                    <ul>
                        {election.nominees && election.nominees.length > 0 ? (
                            election.nominees.map((nominee) => (
                                <li key={nominee._id}>
                                    {nominee.name}
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
                    <h2>Share this election:</h2>
                    <button onClick={() => handleShare('facebook')}>Share on Facebook</button>
                    <button onClick={() => handleShare('x')}>Share on X</button>
                    <button onClick={() => handleShare('telegram')}>Share on Telegram</button>
                    <button onClick={() => handleShare('snapchat')}>Share on Snapchat</button>
                    <button onClick={() => handleShare('instagram')}>Share on Instagram</button>
                    <button onClick={() => handleShare('tiktok')}>Share on TikTok</button>
                </>
            ) : (
                <p>Select an election to view its details.</p>
            )}
        </div>
    );
};

export default Voting;
