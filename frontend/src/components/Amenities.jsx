import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Amenities.css';

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get('https://relaxee.onrender.com/amenities');
        if (response.data.success) {
          setAmenities(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching amenities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  if (loading) return <div className="loading">Loading amenities...</div>;

  return (
    <section id="amenities" className="amenities-section">
      <div className="container">
        <h2>Resort Amenities</h2>
        <p className="section-subtitle">Enjoy world-class facilities during your stay</p>
        
        <div className="amenities-grid">
          {amenities.map(amenity => (
            <div key={amenity._id} className="amenity-card">
              <div className="amenity-icon">
                {amenity.icon}
              </div>
              <h3>{amenity.name}</h3>
              <p>{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;