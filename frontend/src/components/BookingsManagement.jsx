import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingsManagement.css';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://resort-backend-oa7j.onrender.com/api/admin/bookings');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.put(`https://relaxee.onrender.com/api/admin/bookings/${bookingId}/status`, {
        status
      });

      if (response.data.success) {
        // Update local state
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId ? { ...booking, status } : booking
          )
        );
        alert(`Booking ${status} successfully!`);
      }
    } catch (error) {
      alert('Error updating booking status: ' + error.response?.data?.message);
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter(booking => booking.status === filter);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  const filteredBookings = getFilteredBookings();

  return (
    <div className="bookings-management">
      <div className="section-header">
        <h2>Booking Management</h2>
        <p>Manage all guest bookings and reservations</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Bookings ({bookings.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({bookings.filter(b => b.status === 'pending').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({bookings.filter(b => b.status === 'completed').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <p>No bookings found for the selected filter.</p>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking._id} className={`booking-card ${booking.status}`}>
              <div className="booking-header">
                <div className="guest-info">
                  <h4>{booking.guestName}</h4>
                  <span className="guest-contact">
                    {booking.email} • {booking.phone}
                  </span>
                </div>
                <div className="booking-meta">
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                  <span className="booking-date">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <span className="label">Room:</span>
                  <span className="value">{booking.room?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Check-in:</span>
                  <span className="value">{new Date(booking.checkIn).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Check-out:</span>
                  <span className="value">{new Date(booking.checkOut).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Guests:</span>
                  <span className="value">
                    {booking.adults} Adult{booking.adults > 1 ? 's' : ''}
                    {booking.children > 0 && `, ${booking.children} Child${booking.children > 1 ? 'ren' : ''}`}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Total:</span>
                  <span className="value price">₹{booking.totalPrice}</span>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="special-requests">
                  <strong>Special Requests:</strong>
                  <p>{booking.specialRequests}</p>
                </div>
              )}

              <div className="booking-actions">
                <button 
                  className="btn-view"
                  onClick={() => handleViewDetails(booking)}
                >
                  View Details
                </button>
                
                {booking.status === 'pending' && (
                  <>
                    <button 
                      className="btn-confirm"
                      onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                    >
                      Confirm
                    </button>
                    <button 
                      className="btn-cancel"
                      onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {booking.status === 'confirmed' && (
                  <>
                    <button 
                      className="btn-complete"
                      onClick={() => updateBookingStatus(booking._id, 'completed')}
                    >
                      Mark Complete
                    </button>
                    <button 
                      className="btn-cancel"
                      onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {(booking.status === 'completed' || booking.status === 'cancelled') && (
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this booking?')) {
                        // Add delete functionality here
                        console.log('Delete booking:', booking._id);
                      }
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal 
          booking={selectedBooking}
          onClose={handleCloseModal}
          onStatusUpdate={updateBookingStatus}
        />
      )}
    </div>
  );
};

// Booking Details Modal Component
const BookingDetailsModal = ({ booking, onClose, onStatusUpdate }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h3>Booking Details</h3>
          <span className={`status-badge large ${booking.status}`}>
            {booking.status}
          </span>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h4>Guest Information</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Name:</label>
                <span>{booking.guestName}</span>
              </div>
              <div className="detail-item">
                <label>Email:</label>
                <span>{booking.email}</span>
              </div>
              <div className="detail-item">
                <label>Phone:</label>
                <span>{booking.phone}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Booking Information</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Room:</label>
                <span>{booking.room?.name} ({booking.room?.type})</span>
              </div>
              <div className="detail-item">
                <label>Check-in:</label>
                <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <label>Check-out:</label>
                <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <label>Nights:</label>
                <span>{booking.totalNights}</span>
              </div>
              <div className="detail-item">
                <label>Guests:</label>
                <span>
                  {booking.adults} Adult{booking.adults > 1 ? 's' : ''}
                  {booking.children > 0 && `, ${booking.children} Child${booking.children > 1 ? 'ren' : ''}`}
                </span>
              </div>
              <div className="detail-item">
                <label>Total Amount:</label>
                <span className="price">₹{booking.totalPrice}</span>
              </div>
            </div>
          </div>

          {booking.specialRequests && (
            <div className="detail-section">
              <h4>Special Requests</h4>
              <p>{booking.specialRequests}</p>
            </div>
          )}

          <div className="detail-section">
            <h4>Booking Timeline</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Booking Date:</label>
                <span>{new Date(booking.bookingDate).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <label>Last Updated:</label>
                <span>{new Date(booking.updatedAt || booking.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          {booking.status === 'pending' && (
            <>
              <button 
                className="btn-confirm"
                onClick={() => {
                  onStatusUpdate(booking._id, 'confirmed');
                  onClose();
                }}
              >
                Confirm Booking
              </button>
              <button 
                className="btn-cancel"
                onClick={() => {
                  onStatusUpdate(booking._id, 'cancelled');
                  onClose();
                }}
              >
                Cancel Booking
              </button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <button 
              className="btn-complete"
              onClick={() => {
                onStatusUpdate(booking._id, 'completed');
                onClose();
              }}
            >
              Mark as Completed
            </button>
          )}
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;