import React from 'react';
import './Styles/PrivacyPolicy.css'

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <h2>Privacy Policy</h2>
      
      <section className="introduction">
        <p>Welcome to KOROJO's Privacy Policy page. At KOROJO, we are committed to protecting your personal information and your right to privacy. This policy outlines what information we collect, how we use it, and what rights you have in relation to it.</p>
      </section>

      <section className="information-collection">
        <h3>1. Information We Collect</h3>
        <p>We may collect and store the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Information you provide to us when creating an account, such as your name, email address, and contact details.</li>
          <li><strong>Usage Data:</strong> Information about your interactions with our platform, including the pages visited, time spent, and actions taken.</li>
          <li><strong>Technical Data:</strong> Information collected automatically when you use our platform, such as IP addresses, browser type, and device information.</li>
        </ul>
      </section>
      
      <section className="use-of-information">
        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li><strong>To provide and improve our services:</strong> Including to create and manage user accounts, process votes, and enhance user experience.</li>
          <li><strong>To communicate with you:</strong> To send you updates, respond to your inquiries, and provide necessary notifications about your elections.</li>
          <li><strong>To ensure security:</strong> We use technical and administrative measures to secure your data and protect our platform from unauthorized access.</li>
        </ul>
      </section>

      <section className="sharing-information">
        <h3>3. Sharing Your Information</h3>
        <p>We do not sell or share your personal information with third parties for their own marketing purposes. We may share your data only in the following situations:</p>
        <ul>
          <li><strong>Service Providers:</strong> With third-party service providers who assist us in delivering our services, under strict confidentiality agreements.</li>
          <li><strong>Legal Obligations:</strong> When required by law, court order, or other legal processes.</li>
        </ul>
      </section>

      <section className="data-security">
        <h3>4. Data Security</h3>
        <p>Your data security is our priority. We use a variety of security measures, including encryption, to protect your personal information from unauthorized access, alteration, and destruction.</p>
      </section>

      <section className="data-retention">
        <h3>5. Data Retention</h3>
        <p>We retain your personal information only as long as necessary to fulfill the purposes for which it was collected, and as required by applicable laws. When no longer needed, we securely delete or anonymize your data.</p>
      </section>

      <section className="user-rights">
        <h3>6. Your Rights</h3>
        <p>You have certain rights regarding your personal information, including:</p>
        <ul>
          <li><strong>Access:</strong> The right to request access to your personal data.</li>
          <li><strong>Correction:</strong> The right to request corrections if your data is inaccurate or incomplete.</li>
          <li><strong>Deletion:</strong> The right to request deletion of your data, under certain conditions.</li>
          <li><strong>Objection:</strong> The right to object to data processing based on legitimate interests.</li>
        </ul>
        <p>If you wish to exercise any of these rights, please contact us at <a href="mailto:birukmitiku16@gmail.com">birukmitiku16@gmail.com</a>.</p>
      </section>

      <section className="updates">
        <h3>7. Updates to This Policy</h3>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any changes by posting the new policy on this page.</p>
      </section>

      <section className="contact">
        <h3>8. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy or our data practices, please feel free to <a href="mailto:birukmitiku16@gmail.com">contact us</a>.</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
