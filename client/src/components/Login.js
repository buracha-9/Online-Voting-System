import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous error messages
        setLoading(true); // Set loading state to true

        try {
            const response = await axios.post('http://localhost:3500/auth', { email, password });

            // Get token and role from the response
            const { accessToken, role } = response.data;

            // Store the token in local storage
            localStorage.setItem('token', accessToken);
            localStorage.setItem('role', role); // Store role for use in PrivateRoute

            // Redirect based on user role
            if (role.toLowerCase() === 'admin') {
                navigate('/admin');
            } else if (role.toLowerCase() === 'voter') {
                navigate('/elections');
            } else {
                setErrorMessage('Unknown role. Access denied.');
            }
        } catch (error) {
            console.error('Login error:', error); // Log the error for debugging
            setErrorMessage('Login failed. Please check your credentials.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorMessage(''); // Clear error on input change
                        }}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMessage(''); // Clear error on input change
                        }}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}> {/* Disable button while loading */}
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
