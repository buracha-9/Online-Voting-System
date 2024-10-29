import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Check for the token on mount
        if (token) {
            navigate('/elections'); // Redirect to elections if already logged in
        }
    }, [navigate]);

    const handleElectionLinkClick = () => {
        const token = localStorage.getItem('token'); // Check for the token

        if (token) {
            navigate('/elections'); // Redirect to elections if logged in
        } else {
            navigate('/login'); // Redirect to login if not logged in
        }
    };

    return (
        <div className="home-container">
            <h1>Welcome to the Voting System</h1>
            <p>Please login or register to participate in upcoming elections.</p>
            <div className="auth-links">
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn">Register</Link>
            </div>

            {/* Link to elections */}
            <div className="elections-link">
                <button className="btn" onClick={handleElectionLinkClick}>
                    View Available Elections
                </button>
            </div>
        </div>
    );
};

export default HomePage;
