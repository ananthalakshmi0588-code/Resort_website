import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [averageRating, setAverageRating] = useState(0);
  const [ratingStats, setRatingStats] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(false);

  // useCallback for fetch function - INDUSTRY STANDARD
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://relaxee.onrender.com/api/reviews/approved');
      if (response.data.success) {
        const approvedReviews = response.data.data;
        setReviews(approvedReviews);
        calculateRatingStats(approvedReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const calculateRatingStats = (reviews) => {
    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avg = totalRating / reviews.length;
    setAverageRating(avg.toFixed(1));

    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      stats[review.rating]++;
    });
    setRatingStats(stats);
  };

  const handleReviewSubmit = () => {
    // Refresh reviews after new submission
    fetchReviews();
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'star filled' : 'star'}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const getRoomTypeLabel = (roomType) => {
    const labels = {
      'villa-balcony-view': 'Beach Front Villa',
      'villa-garden-view': 'Garden View Villa',
      'suite': 'Family Suite',
      'deluxe': 'Deluxe Room',
      'family': 'Family Suite'
    };
    return labels[roomType] || roomType;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(filter));

  const featuredReviews = reviews.filter(review => review.featured);
  const regularReviews = reviews.filter(review => !review.featured);

  if (loading) return <div className="loading">Loading reviews...</div>;

  return (
    <section id="reviews" className="reviews-section">
      <div className="container">
        <div className="reviews-header">
          <h2>Guest Reviews</h2>
          <p>See what our guests are saying about their experience at Nandhini Beach Resort</p>
        </div>

        {/* Rating Overview */}
        <div className="rating-overview">
          <div className="average-rating">
            <div className="rating-number">{averageRating}</div>
            <div className="rating-stars">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="rating-count">{reviews.length} Reviews</div>
          </div>
          
          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="rating-bar">
                <span className="rating-label">{rating} ⭐</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${reviews.length ? (ratingStats[rating] / reviews.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="rating-count">{ratingStats[rating] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="review-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Reviews
          </button>
          <button 
            className={`filter-btn ${filter === '5' ? 'active' : ''}`}
            onClick={() => setFilter('5')}
          >
            5 Stars
          </button>
          <button 
            className={`filter-btn ${filter === '4' ? 'active' : ''}`}
            onClick={() => setFilter('4')}
          >
            4 Stars
          </button>
        </div>

        {/* Featured Reviews */}
        {featuredReviews.length > 0 && filter === 'all' && (
          <div className="featured-reviews">
            <h3>Featured Reviews</h3>
            <div className="reviews-grid featured-grid">
              {featuredReviews.map(review => (
                <div key={review._id} className="review-card featured">
                  <div className="featured-badge">Featured</div>
                  <div className="review-header">
                    <div className="guest-avatar">
                      {review.guestName.charAt(0)}
                    </div>
                    <div className="guest-info">
                      <h4>{review.guestName}</h4>
                      <div className="review-meta">
                        <span className="room-type">{getRoomTypeLabel(review.roomType)}</span>
                        <span className="stay-date">{formatDate(review.stayDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  
                  <h5 className="review-title">{review.title}</h5>
                  <p className="review-comment">"{review.comment}"</p>
                  
                  {review.verified && (
                    <div className="verified-badge">
                      ✓ Verified Stay
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Reviews Grid */}
        <div className="reviews-grid">
          {(filter === 'all' ? regularReviews : filteredReviews).map(review => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="guest-avatar">
                  {review.guestName.charAt(0)}
                </div>
                <div className="guest-info">
                  <h4>{review.guestName}</h4>
                  <div className="review-meta">
                    <span className="room-type">{getRoomTypeLabel(review.roomType)}</span>
                    <span className="stay-date">{formatDate(review.stayDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
              
              <h5 className="review-title">{review.title}</h5>
              <p className="review-comment">"{review.comment}"</p>
              
              {review.verified && (
                <div className="verified-badge">
                  ✓ Verified Stay
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="no-reviews">
            <h3>No reviews found</h3>
            <p>There are no reviews matching your selected filter.</p>
          </div>
        )}

        {/* Review CTA */}
        <div className="review-cta">
          <h3>Share Your Experience</h3>
          <p>Stayed with us recently? We'd love to hear about your experience!</p>
          <button 
            className="cta-button"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          onClose={() => setShowReviewForm(false)}
          onReviewSubmit={handleReviewSubmit}
        />
      )}
    </section>
  );
};

export default Reviews;