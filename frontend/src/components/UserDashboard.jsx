import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Staff Dashboard</h1>
      <div className="dashboard-content">
        <p>Welcome, {user?.name} ({user?.role})</p>
        <p>This is your staff dashboard. You can:</p>
        <ul>
          <li>View today's bookings</li>
          <li>Manage room status</li>
          <li>Check-in/Check-out guests</li>
          <li>View guest requests</li>
        </ul>
        <div className="dashboard-actions">
          <button>Today's Bookings</button>
          <button>Room Status</button>
          <button>Guest Services</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;