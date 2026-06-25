import React, { useState, useEffect, useCallback } from 'react'; // ✅ Added useCallback
import axios from 'axios';
import './ReviewsManagement.css';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedReview, setSelectedReview] = useState(null);

  // FIX: Wrap fetchReviews in useCallback to make it stable
  const fetchReviews = useCallback(async () => {
    try {
      let url = 'https://resort-backend-oa7j.onrender.com/api/admin/reviews/pending';
      if (filter === 'approved') {
        url = 'https://resort-backend-oa7j.onrender.com/api/reviews/approved';
      } else if (filter === 'all') {
        url = 'https://resort-backend-oa7j.onrender.com/api/reviews';
      }

      const response = await axios.get(url);
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]); // Add filter as dependency

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // Now fetchReviews is stable and can be included

  const approveReview = async (reviewId) => {
    try {
      const response = await axios.put(`https://resort-backend-oa7j.onrender.com/api/admin/reviews/${reviewId}/approve`);
      
      if (response.data.success) {
        // Remove from current list or update status
        setReviews(prevReviews => 
          prevReviews.filter(review => review._id !== reviewId)
        );
        alert('Review approved successfully!');
      }
    } catch (error) {
      alert('Error approving review: ' + error.response?.data?.message);
    }
  };

  const featureReview = async (reviewId) => {
    try {
      const response = await axios.put(`https://resort-backend-oa7j.onrender.com/api/reviews/${reviewId}`, {
        featured: true
      });
      
      if (response.data.success) {
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review._id === reviewId ? { ...review, featured: true } : review
          )
        );
        alert('Review featured successfully!');
      }
    } catch (error) {
      alert('Error featuring review: ' + error.response?.data?.message);
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`https://relaxee.onrender.com/api/reviews/${reviewId}`);
        
        if (response.data.success) {
          setReviews(prevReviews => 
            prevReviews.filter(review => review._id !== reviewId)
          );
          alert('Review deleted successfully!');
        }
      } catch (error) {
        alert('Error deleting review: ' + error.response?.data?.message);
      }
    }
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
  };

  if (loading) return <div className="loading">Loading reviews...</div>;

  return (
    <div className="reviews-management">
      <div className="section-header">
        <h2>Review Management</h2>
        <p>Approve, feature, and manage guest reviews</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          ⏳ Pending Approval ({reviews.filter(r => !r.approved).length})
        </button>
        <button 
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          ✅ Approved Reviews ({reviews.filter(r => r.approved).length})
        </button>
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          📋 All Reviews ({reviews.length})
        </button>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews found for the selected filter.</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review._id} className={`review-card ${review.featured ? 'featured' : ''} ${review.approved ? 'approved' : 'pending'}`}>
              {review.featured && <div className="featured-badge">⭐ Featured</div>}
              
              <div className="review-header">
                <div className="reviewer-info">
                  <h4>{review.guestName}</h4>
                  <span className="reviewer-email">{review.email}</span>
                </div>
                <div className="review-meta">
                  <span className="rating">⭐ {review.rating}/5</span>
                  <span className="room-type">{review.roomType}</span>
                  <span className="review-date">
                    {new Date(review.stayDate).toLocaleDateString()}
                  </span>
                  <span className={`status ${review.approved ? 'approved' : 'pending'}`}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="review-content">
                <h5 className="review-title">{review.title}</h5>
                <p className="review-comment">"{review.comment}"</p>
              </div>

              <div className="review-actions">
                <button 
                  className="btn-view"
                  onClick={() => handleViewDetails(review)}
                >
                  View Details
                </button>

                {!review.approved ? (
                  <>
                    <button 
                      className="btn-approve"
                      onClick={() => approveReview(review._id)}
                    >
                      ✅ Approve
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => deleteReview(review._id)}
                    >
                      ❌ Reject
                    </button>
                  </>
                ) : (
                  <>
                    {!review.featured && (
                      <button 
                        className="btn-feature"
                        onClick={() => featureReview(review._id)}
                      >
                        ⭐ Feature
                      </button>
                    )}
                    <button 
                      className="btn-delete"
                      onClick={() => deleteReview(review._id)}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>

              <div className="review-footer">
                <span className="submitted-date">
                  Submitted: {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <ReviewDetailsModal 
          review={selectedReview}
          onClose={handleCloseModal}
          onApprove={approveReview}
          onFeature={featureReview}
          onDelete={deleteReview}
        />
      )}
    </div>
  );
};

// Review Details Modal Component
const ReviewDetailsModal = ({ review, onClose, onApprove, onFeature, onDelete }) => {
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h3>Review Details</h3>
          <div className="modal-status">
            {review.featured && <span className="featured-badge">⭐ Featured</span>}
            <span className={`status-badge large ${review.approved ? 'approved' : 'pending'}`}>
              {review.approved ? 'Approved' : 'Pending Approval'}
            </span>
          </div>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h4>Reviewer Information</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Name:</label>
                <span>{review.guestName}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{review.email}</span>
              </div>
              <div className="detail-item">
                <label>Room Type:</label>
                <span>{getRoomTypeLabel(review.roomType)}</span>
              </div>
              <div className="detail-item">
                <label>Stay Date:</label>
                <span>{new Date(review.stayDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Rating</h4>
            <div className="rating-display">
              {renderStars(review.rating)}
              <span className="rating-text">{review.rating} out of 5 stars</span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Review Content</h4>
            <div className="review-content-modal">
              <h5>{review.title}</h5>
              <p>"{review.comment}"</p>
            </div>
          </div>

          <div className="detail-section">
            <h4>Review Timeline</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Submitted:</label>
                <span>{new Date(review.createdAt).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <label>Last Updated:</label>
                <span>{new Date(review.updatedAt || review.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          {!review.approved ? (
            <>
              <button 
                className="btn-approve"
                onClick={() => {
                  onApprove(review._id);
                  onClose();
                }}
              >
                ✅ Approve Review
              </button>
              <button 
                className="btn-delete"
                onClick={() => {
                  onDelete(review._id);
                  onClose();
                }}
              >
                ❌ Reject Review
              </button>
            </>
          ) : (
            <>
              {!review.featured && (
                <button 
                  className="btn-feature"
                  onClick={() => {
                    onFeature(review._id);
                    onClose();
                  }}
                >
                  ⭐ Feature Review
                </button>
              )}
              <button 
                className="btn-delete"
                onClick={() => {
                  onDelete(review._id);
                  onClose();
                }}
              >
                🗑️ Delete Review
              </button>
            </>
          )}
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsManagement;