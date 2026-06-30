// components/BookingForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './BookingForm.css';
const API_URL = import.meta.env.VITE_API_URL;

const BookingForm = ({ room, package: pkg, onClose, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    adults: pkg?.maxGuests?.adults || 2,
    children: pkg?.maxGuests?.children || 0,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);

  // Determine if it's a room booking or package booking
  const isPackageBooking = !!pkg;
  const bookingItem = room || pkg;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (isPackageBooking) {
        // Handle package booking
        response = await axios.post('https://resort-backend-oa7j.onrender.com/api/bookings', {
          guestName: formData.guestName,
          email: formData.email,
          phone: formData.phone,
          packageId: pkg._id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          adults: parseInt(formData.adults),
          children: parseInt(formData.children),
          roomType: pkg.roomTypes?.[0] || 'deluxe',
          specialRequests: `Package: ${pkg.name}. ${formData.specialRequests}`,
          totalPrice: pkg.price
        });
      } else {
        // Handle room booking
        response = await axios.post('https://relaxee.onrender.com/api/bookings', {
          guestName: formData.guestName,
          email: formData.email,
          phone: formData.phone,
          roomId: room._id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          adults: parseInt(formData.adults),
          children: parseInt(formData.children),
          specialRequests: formData.specialRequests
        });
      }

      if (response.data.success) {
        alert('Booking request submitted successfully! We will contact you for confirmation.');
        if (onBookingSuccess) onBookingSuccess();
        if (onClose) onClose();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    if (isPackageBooking) {
      return pkg.price; // Package has fixed price
    } else {
      // Room price calculation
      if (formData.checkIn && formData.checkOut) {
        const nights = Math.ceil(
          (new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)
        );
        return room.pricePerNight * nights;
      }
      return 0;
    }
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-container">
        <div className="booking-form-header">
          <h2>
            {isPackageBooking ? `Book ${pkg.name} Package` : `Book ${room.name}`}
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          {/* Personal Details */}
          <div className="form-section">
            <h4>Personal Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Booking Details */}
          <div className="form-section">
            <h4>Booking Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Check-in Date *</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Check-out Date *</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Adults *</label>
                <select 
                  name="adults" 
                  value={formData.adults} 
                  onChange={handleChange} 
                  required
                  max={isPackageBooking ? pkg.maxGuests?.adults : room.maxAdults}
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Children</label>
                <select 
                  name="children" 
                  value={formData.children} 
                  onChange={handleChange}
                  max={isPackageBooking ? pkg.maxGuests?.children : room.maxChildren}
                >
                  {[0, 1, 2, 3].map(num => (
                    <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Special Requests</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any special requirements or requests..."
              rows="3"
            />
          </div>

          <div className="booking-summary">
            <h4>Booking Summary</h4>
            <div className="summary-row">
              <span>{isPackageBooking ? 'Package:' : 'Room:'}</span>
              <span>{bookingItem.name}</span>
            </div>
            <div className="summary-row">
              <span>{isPackageBooking ? 'Package Price:' : 'Price per night:'}</span>
              <span>₹{isPackageBooking ? pkg.price : room.pricePerNight}</span>
            </div>
            {formData.checkIn && formData.checkOut && !isPackageBooking && (
              <>
                <div className="summary-row">
                  <span>Nights:</span>
                  <span>{Math.ceil(
                    (new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)
                  )}</span>
                </div>
              </>
            )}
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;