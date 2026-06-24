import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import BookingsManagement from './BookingsManagement';
import ReviewsManagement from './ReviewsManagement';
import RoomsManagement from './RoomsManagement';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('https://resort-backend-oa7j.onrender.com/api/admin/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;
  if (!dashboardData) return <div className="admin-error">Failed to load dashboard</div>;

  const { stats, recentBookings } = dashboardData;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Resort Management Dashboard</h1>
        <p>Manage your resort operations efficiently</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📅 Bookings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Reviews
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          🏨 Rooms
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card revenue">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
              </div>
            </div>

            <div className="stat-card bookings">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>{stats.totalBookings}</h3>
                <p>Total Bookings</p>
              </div>
            </div>

            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.pendingBookings}</h3>
                <p>Pending Bookings</p>
              </div>
            </div>

            <div className="stat-card reviews">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>{stats.totalReviews}</h3>
                <p>Total Reviews</p>
              </div>
            </div>

            <div className="stat-card pending-reviews">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <h3>{stats.pendingReviews}</h3>
                <p>Pending Reviews</p>
              </div>
            </div>

            <div className="stat-card rooms">
              <div className="stat-icon">🏨</div>
              <div className="stat-info">
                <h3>{stats.totalRooms}</h3>
                <p>Total Rooms</p>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="recent-section">
            <h2>Recent Bookings</h2>
            <div className="bookings-list">
              {recentBookings.map(booking => (
                <div key={booking._id} className="booking-item">
                  <div className="booking-header">
                    <h4>{booking.guestName}</h4>
                    <span className={`status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Room:</strong> {booking.room?.name}</p>
                    <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ₹{booking.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <BookingsManagement />
      )}

      {activeTab === 'reviews' && (
        <ReviewsManagement />
      )}

      {activeTab === 'rooms' && (
        <RoomsManagement />
      )}
    </div>
  );
};





export default AdminDashboard;