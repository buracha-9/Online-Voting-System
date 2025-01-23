import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Styles/HomePage.css';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in by verifying the presence of a token
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Convert token to boolean
    }, []);

    const handleElectionLinkClick = () => {
        // Redirect based on the login status
        navigate(isLoggedIn ? '/elections' : '/login');
    };

    return (
        <div className="homepage">
            {/* Welcome Section */}
            <section className="welcome-section" aria-label="Welcome Section">
                <div className="welcome-content">
                    <h1>Welcome to the Voting System</h1>
                    <p>Your voice matters. Participate in fair, transparent elections that ensure integrity and privacy.</p>
                    <button 
                        className="learn-more-btn" 
                        onClick={handleElectionLinkClick} 
                        aria-label={isLoggedIn ? "Proceed to elections" : "Login to vote"}
                    >
                        Get Started
                    </button>
                </div>
            </section>
    
            {/* Feature Section */}
            <section className="feature-section" aria-label="Features">
                {[
                    {
                        imgSrc: "https://images.pexels.com/photos/5926383/pexels-photo-5926383.jpeg?auto=compress&cs=tinysrgb&w=600",
                        alt: "Simple & User-Friendly",
                        title: "Simple & User-Friendly",
                        description: "Our voting platform is designed to be intuitive and accessible for all users, making it easy for anyone, regardless of technical skill, to participate in the voting process with confidence and ease."
                    },
                    {
                        imgSrc: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        alt: "Secure and Private",
                        title: "Secure and Private",
                        description: "Your privacy is our top priority. We use advanced encryption and data protection measures to ensure that your vote is confidential and cannot be accessed by unauthorized parties."
                    },
                    {
                        imgSrc: "https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        alt: "Verified Voter Authentication",
                        title: "Verified Voter Authentication",
                        description: "To maintain election integrity, we verify each voter’s identity before allowing access to the voting platform. This ensures that only eligible and authorized voters can cast their vote."
                    }
                ].map((feature, index) => (
                    <div className="feature" key={index}>
                        <img src={feature.imgSrc} alt={feature.alt} className="feature-image" />
                        <div className="feature-text">
                            <h3>{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </section>
          
            {/* About Section */}
            <section className="about-section" aria-label="About Us">
                <div className="about-content">
                    <h2>About Us</h2>
                    <p>We aim to provide a reliable platform for secure online voting. Our system is designed to empower voters while maintaining confidentiality and transparency.</p>
                    <Link to="/about" className="learn-more-btn" aria-label="Learn more about us">Learn More About Us</Link>
                </div>
                <img src="https://static.vecteezy.com/system/resources/previews/007/126/739/non_2x/question-mark-icon-free-vector.jpg" alt="About Us" className="about-image"/>
            </section>
        </div>
    );
};

export default HomePage;
