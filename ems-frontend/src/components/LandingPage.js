import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to </h1>
        <p>Employee Management System made simple and secure.</p>
        <button className="get-started-btn" onClick={() => navigate('/register')}>Get Started</button>
      </div>
    </div>
  );
};

export default LandingPage;
