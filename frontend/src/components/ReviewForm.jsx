import React, { useState } from 'react';
import axios from 'axios';
import './ReviewForm.css';

const ReviewForm = ({ onClose, onReviewSubmit }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    rating: 0,
    title: '',
    comment: '',
    roomType: '',
    stayDate: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const roomTypes = [
    { value: 'villa-balcony-view', label: 'Beach Front Villa' },
    { value: 'villa-garden-view', label: 'Garden View Villa' },
    { value: 'suite', label: 'Family Suite' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'family', label: 'Family Suite' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/reviews', formData);
      
      if (response.data.success) {
        setMessage('Review submitted successfully! It will be visible after approval.');
        
        // Reset form
        setFormData({
          guestName: '',
          email: '',
          rating: 0,
          title: '',
          comment: '',
          roomType: '',
          stayDate: ''
        });
        
        // Notify parent component
        if (onReviewSubmit) {
          onReviewSubmit();
        }
        
        // Auto close after 3 seconds
        setTimeout(() => {
          if (onClose) onClose();
        }, 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting review. Please try again.');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.guestName && 
           formData.email && 
           formData.rating > 0 && 
           formData.title && 
           formData.comment && 
           formData.roomType && 
           formData.stayDate;
  };

  const isSuccess = message && message.includes('successfully');

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <div className="review-form-header">
          <h2>{isSuccess ? 'Thank You!' : 'Write a Review'}</h2>
          {!isSuccess && (
            <button className="close-btn" onClick={onClose}>×</button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {!isSuccess ? (
            <>
              <div className="form-group">
                <label htmlFor="guestName">Your Name *</label>
                <input
                  type="text"
                  id="guestName"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>Room Type *</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map(room => (
                    <option key={room.value} value={room.value}>
                      {room.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stayDate">Stay Date *</label>
                <input
                  type="date"
                  id="stayDate"
                  name="stayDate"
                  value={formData.stayDate}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Your Rating *</label>
                <div className="rating-stars-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star-input ${star <= (hoverRating || formData.rating) ? 'filled' : ''}`}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="rating-text">
                  {formData.rating > 0 ? `${formData.rating} Star${formData.rating > 1 ? 's' : ''}` : 'Select rating'}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Review Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Summarize your experience"
                  maxLength="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="comment">Your Review *</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  required
                  placeholder="Share details of your experience at the resort..."
                  rows="4"
                  maxLength="500"
                />
                <div className="char-count">
                  {formData.comment.length}/500 characters
                </div>
              </div>
            </>
          ) : null}

          {message && (
            <div className={`message ${isSuccess ? 'success' : 'error'}`}>
              {message}
              {isSuccess && <div className="auto-close">Closing automatically in 3 seconds...</div>}
            </div>
          )}

          <div className="form-actions">
            {isSuccess ? (
              <button
                type="button"
                className="btn-primary"
                onClick={onClose}
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!isFormValid() || submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;