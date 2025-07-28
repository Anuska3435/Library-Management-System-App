// src/components/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">📖 Welcome to Smart Library</h1>
      <p className="landing-subtitle">Welcome to your new library experience! Discover, explore, and manage your literary journey with ease. <br /> Our intuitive library system puts a world of knowledge at your fingertips, offering seamless access to our extensive collection, <br />  personalized recommendations, and convenient account management. Dive in and make the most of your reading adventures!</p>
      <button className="get-started-button" onClick={() => navigate("/login")}>
        Get Started
      </button>
    </div>
  );
};

export default Landing;
