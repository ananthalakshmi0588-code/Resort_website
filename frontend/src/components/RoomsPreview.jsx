// components/RoomsPreview.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RoomsPreview.css';

const RoomsPreview = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        if (response.data.success) {
          // Show only 3 featured rooms on homepage
          setRooms(response.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleViewAllRooms = () => {
    // Navigate to separate rooms page
    navigate('/rooms');
  };

  if (loading) return <div className="loading">Loading rooms...</div>;
   if (error) return <div className="error">{error}</div>; 

  return (
    <section className="rooms-preview-section">
      <div className="container">
        <div className="preview-header">
          <h2>Luxurious Rooms & Suites</h2>
          <p>Experience unparalleled comfort in our beautifully designed accommodations</p>
        </div>
        
        <div className="rooms-preview-grid">
          {rooms.map(room => (
            <div key={room._id} className="preview-room-card">
              <div className="room-image">
                <img 
                  src={`https://resort-backend-oa7j.onrender.com${room.images[0]}`}
                  alt={room.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x250/2c5530/white?text=Image+Missing';
                  }}
                />
              </div>
              
              <div className="preview-room-info">
                <h3>{room.name}</h3>
                <p className="room-short-desc">
                  {room.description.length > 100 
                    ? `${room.description.substring(0, 100)}...` 
                    : room.description
                  }
                </p>
                
                <div className="preview-room-features">
                  <span className="capacity">👤 {room.maxAdults} Adults</span>
                  {room.maxChildren > 0 && (
                    <span className="capacity">👶 {room.maxChildren} Children</span>
                  )}
                </div>
                
                <div className="preview-room-price">
                  From ₹{room.pricePerNight}/night
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="preview-actions">
          <button className="view-all-btn" onClick={handleViewAllRooms}>
            View All Rooms & Suites
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoomsPreview;