// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/Header.css'

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">KOROJO</Link>
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
