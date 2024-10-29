// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">My App</Link>
            </div>
            <nav className="navigation">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/login">Login</Link> 
                <Link to="/register">Register</Link> 
            </nav>
        </header>
    );
};

export default Header;
