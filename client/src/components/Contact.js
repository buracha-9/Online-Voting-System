import React, { useState } from 'react';
import './Styles/Contact.css'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you can handle form submission, such as sending the data to a server
    // For now, we'll just simulate a successful submission
    if (formData.name && formData.email && formData.message) {
      setSuccessMessage('Your message has been sent successfully!');
      setErrorMessage('');
      // Clear form fields
      setFormData({ name: '', email: '', message: '' });
    } else {
      setErrorMessage('Please fill in all fields.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
      <div className="contact-info">
        <h3>Other Ways to Reach Us</h3>
        <p>If you prefer to reach us directly, you can email us at <a href="mailto:birukmitiku16@gmail.com">birukmitiku16@gmail.com</a>.</p>
        <p>Follow us on social media:</p>
        <ul>
          <li><a href="https://facebook.com">Facebook</a></li>
          <li><a href="https://twitter.com">Twitter</a></li>
          <li><a href="https://linkedin.com">LinkedIn</a></li>
        </ul>
      </div>
    </div>
  );
};

export default ContactPage;
