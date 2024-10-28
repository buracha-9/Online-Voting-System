import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-container">
            <h1>Welcome to the Voting System</h1>
            <p>Please login or register to participate in upcoming elections.</p>
            <div className="auth-links">
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn">Register</Link>
            </div>
        </div>
    );
};

export default HomePage;
