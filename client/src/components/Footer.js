// Footer.js
import React from 'react';
import './Styles/Header.css'

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} KOROJO. All rights reserved.</p>
            <div className="footer-links">
                <a href="/privacypolicy">Privacy Policy</a>
                <a href="/termsofservice">Terms of Service</a>
                <a href="/contact">Contact</a>
            </div>
        </footer>
    );
};

export default Footer;
