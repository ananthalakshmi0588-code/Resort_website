import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Welcome.css';

const Welcome = () => {
  const [welcomeData, setWelcomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWelcomeData = async () => {
      try {
        const response = await axios.get('https://relaxee.onrender.com/api/welcome');
        if (response.data.success) {
          setWelcomeData(response.data.data);
        }
      } catch (err) {
        setError('Failed to load welcome data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWelcomeData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>{error}</div>
      </div>
    );
  }

  if (!welcomeData) {
    return (
      <div className="no-data-container">
        <div>No welcome data available</div>
      </div>
    );
  }
  console.log(welcomeData.backgroundImage);

  return (
    <section id="home" className="welcome-section">
    <div 
      className="welcome-container"
       style={{ 
         backgroundImage: `url(${welcomeData.backgroundImage})`  // ← FIXED THIS LINE
       }}
    >
      {/* <img
      src={welcomeData.backgroundImage}
      alt="Resort"
      style={{
        width: "100%",
        height: "500px",
        objectFit: "cover"
      }}
    /> */}
      <div className="welcome-overlay">
        <div className="welcome-content">
          <h1 className="welcome-title">{welcomeData.title}</h1>
          <p className="welcome-subtitle">{welcomeData.subtitle}</p>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Welcome;