import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingForm from './BookingForm'; // ✅ Make sure this import is added
import './Rooms.css';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ✅ ADD: Booking form states
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('https://relaxee.onrender.com/api/rooms');
        if (response.data.success) {
          setRooms(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  // ✅ UPDATE: This function to use BookingForm
  const handleBookNow = (room) => {
    setSelectedRoomForBooking(room);
    setShowBookingForm(true);
  };

  if (loading) return <div className="loading">Loading rooms...</div>;

  return (
    <section id="rooms" className="rooms-section">
      <div className="container">
        <h2>Our Rooms & Suites</h2>
        <div className="rooms-grid">
          {rooms.map(room => (
            <div key={room._id} className={`room-card ${room.featured ? 'featured' : ''}`}>
              <div className="room-type">
                {room.type.replace(/-/g, ' ').toUpperCase()}
              </div>
              
              {room.featured && <div className="featured-badge">Featured</div>}
              
              <img 
                  src={
    room.images[0]?.startsWith('http')
      ? room.images[0]
      : `https://relaxee.onrender.com${room.images[0]}`
  }
                alt={room.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x250/2c5530/white?text=Image+Missing';
                }}
              />
              
              <div className="room-info">
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                
                <div className="room-capacity">
                  <span className="capacity-item"> {room.maxAdults} Adults</span>
                  {room.maxChildren > 0 && (
                    <span className="capacity-item"> {room.maxChildren} Children</span>
                  )}
                </div>
                
                <div className="room-features">
                  {room.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="feature-tag">{amenity}</span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="feature-tag">+{room.amenities.length - 3} more</span>
                  )}
                </div>
                
                <div className="room-price">₹{room.pricePerNight}/night</div>
                
                <button 
                  className="book-btn"
                  onClick={() => handleViewDetails(room)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Details Modal */}
      {isModalOpen && selectedRoom && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            
            <div className="modal-room-details">
              <div className="modal-images">
                <img 
                  src={
  selectedRoom.images[0]?.startsWith('http')
    ? selectedRoom.images[0]
    : `https://relaxee.onrender.com${selectedRoom.images[0]}`
}
                  alt={selectedRoom.name} 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x250/2c5530/white?text=Image+Missing';
                  }}
                />
              </div>
              
              <div className="modal-info">
                <h2>{selectedRoom.name}</h2>
                <div className="modal-price">₹{selectedRoom.pricePerNight}/night</div>
                
                <div className="modal-capacity">
                  <h4>Room Capacity</h4>
                  <p> Max {selectedRoom.maxAdults} Adults</p>
                  {selectedRoom.maxChildren > 0 && (
                    <p> Max {selectedRoom.maxChildren} Children</p>
                  )}
                </div>
                
                <div className="modal-description">
                  <h4>Description</h4>
                  <p>{selectedRoom.description}</p>
                </div>
                
                <div className="modal-amenities">
                  <h4>Amenities</h4>
                  <div className="amenities-grid">
                    {selectedRoom.amenities.map((amenity, index) => (
                      <span key={index} className="amenity-item">✓ {amenity}</span>
                    ))}
                  </div>
                </div>
                
                <div className="modal-actions">
                  {/* ✅ UPDATE: Use handleBookNow instead of direct navigation */}
                  <button 
                    className="book-now-btn"
                    onClick={() => handleBookNow(selectedRoom)}
                  >
                    Book Now
                  </button>
                  <button className="close-modal-btn" onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ ADD: Booking Form Modal - CORRECT SYNTAX */}
      {showBookingForm && selectedRoomForBooking && (
        <BookingForm
          room={selectedRoomForBooking}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedRoomForBooking(null);
          }}
          onBookingSuccess={() => {
            // Optional: You can add success actions here
            console.log('Booking submitted successfully!');
            // You could also refresh rooms data or show a toast message
          }}
        />
      )}
    </section>
  );
};

export default Rooms;