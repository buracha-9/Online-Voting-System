import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="about-page__section about-page__intro">
        <h2 className="about-page__title">About Us</h2>
        <p className="about-page__text">Welcome to KOROJO! Our mission is to provide a secure and efficient platform for online voting that empowers organizations and individuals to conduct elections with confidence and transparency. We believe that digital voting can make participation easier, faster, and safer.</p>
      </section>
      
      <section className="about-page__section about-page__team">
        <h3 className="about-page__subtitle">Who We Are</h3>
        <p className="about-page__text">We are a team of dedicated professionals committed to enhancing online voting experiences through technology. Our team includes developers, security experts, and user experience designers who all share a passion for making voting accessible and reliable for everyone.</p>
        <p className="about-page__text">At KOROJO, we work around the clock to ensure that every voting experience on our platform is seamless and secure. Our team is constantly innovating to stay ahead in the digital election space.</p>
      </section>
      
      <section className="about-page__section about-page__services">
        <h3 className="about-page__subtitle">What We Do</h3>
        <ul className="about-page__services-list">
          <li className="about-page__services-item"><strong>Secure, Transparent Voting:</strong> Our system uses state-of-the-art encryption to ensure votes are safe and counted accurately. We adhere to the highest standards in data protection and election security.</li>
          <li className="about-page__services-item"><strong>User-Friendly Interfaces:</strong> We prioritize ease of use, ensuring that our platform is accessible and intuitive for all users, regardless of their technical experience.</li>
          <li className="about-page__services-item"><strong>Data Privacy and Integrity:</strong> Protecting voter data is one of our core values. We follow strict data privacy protocols to make sure all information remains confidential and secure.</li>
          <li className="about-page__services-item"><strong>24/7 Support:</strong> Our support team is available around the clock to assist with any questions or concerns, ensuring that every election runs smoothly from start to finish.</li>
        </ul>
      </section>
      
      <section className="about-page__section about-page__why-choose-us">
        <h3 className="about-page__subtitle">Why Choose Us?</h3>
        <p className="about-page__text">Choosing KOROJO means choosing a trusted partner in online voting. Our platform is built on a foundation of transparency, security, and commitment to user satisfaction. With real-time monitoring and detailed analytics, we provide tools to keep elections fair and transparent.</p>
        <p className="about-page__text">Our advanced encryption methods, combined with rigorous testing and quality assurance, ensure that every vote is protected, and every election is fair. We understand that trust is paramount, and we are here to earn it with every election held on KOROJO.</p>
      </section>
      
      <section className="about-page__section about-page__contact">
        <h3 className="about-page__subtitle">Contact Us</h3>
        <p className="about-page__text">If you have any questions, feedback, or would like to learn more about how KOROJO can help you organize your next election, please <Link className="about-page__contact-link" to="/contact">reach out to us</Link>. We’re here to help every step of the way.</p>
        <p className="about-page__text">Feel free to follow us on our social media channels and stay updated with the latest news and advancements in digital voting technology.</p>
      </section>
    </div>
  );
};

export default AboutPage;
