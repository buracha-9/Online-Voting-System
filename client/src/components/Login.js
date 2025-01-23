import { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3500/auth', { email, password });
            const { accessToken, role } = response.data;

            localStorage.setItem('token', accessToken);
            localStorage.setItem('role', role);

            // Navigate based on user role
            if (role.toLowerCase() === 'admin') {
                navigate('/admin');
            } else if (role.toLowerCase() === 'voter') {
                navigate('/elections');
            } else {
                setErrorMessage('Unknown role detected. Access denied.');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.status === 401) {
                setErrorMessage('Login failed. Incorrect email or password. Please try again.');
            } else {
                setErrorMessage('Login failed. Please check your credentials and try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <form className="form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <label htmlFor="email">Email:</label>
                    <div className="input-with-icon">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrorMessage('');
                            }}
                            required
                        />
                    </div>
                </div>
                <div className="input-container">
                    <label htmlFor="password">Password:</label>
                    <div className="input-with-icon">
                        <FaLock className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrorMessage('');
                            }}
                            required
                        />
                        <span 
                            className="password-toggle-icon" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? <span className="loader"></span> : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
