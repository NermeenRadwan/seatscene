import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalBookings: 0,
    activeBookings: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, bookingsRes] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/bookings'),
        ]);

        const usersData = usersRes.data;
        const bookingsData = bookingsRes.data;

        setUsers(usersData);
        setBookings(bookingsData);

        setStatistics({
          totalUsers: usersData.length,
          totalBookings: bookingsData.length,
          activeBookings: bookingsData.filter(b => b.status === 'upcoming').length,
          revenue: bookingsData.reduce((acc, b) => acc + parseFloat(b.price), 0).toFixed(2),
        });
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.patch(`/api/bookings/${bookingId}`, { status: 'cancelled' });
        const updatedBookings = bookings.map(b =>
          b._id === bookingId ? { ...b, status: 'cancelled' } : b
        );
        setBookings(updatedBookings);
        setStatistics(prev => ({
          ...prev,
          activeBookings: updatedBookings.filter(b => b.status === 'upcoming').length,
        }));
        alert(`Booking ${bookingId} has been cancelled.`);
      } catch (err) {
        console.error('Error cancelling booking:', err);
      }
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await axios.patch(`/api/users/${userId}`, { status: 'inactive' });
        setUsers(users.map(user =>
          user._id === userId ? { ...user, status: 'inactive' } : user
        ));
        alert(`User ${userId} has been deactivated.`);
      } catch (err) {
        console.error('Error deactivating user:', err);
      }
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await axios.patch(`/api/users/${userId}`, { status: 'active' });
      setUsers(users.map(user =>
        user._id === userId ? { ...user, status: 'active' } : user
      ));
      alert(`User ${userId} has been activated.`);
    } catch (err) {
      console.error('Error activating user:', err);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <div className="admin-logo">
          <img 
            src="/Artboard 1@4x.png" 
            alt="Logo" 
            className="admin-logo"
            onClick={() => navigate('/venue-selection')}
          />
        </div>
        <h1>Admin Dashboard</h1>
        <button className="admin-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card"><h3>Total Users</h3><p className="stat-value">{statistics.totalUsers}</p></div>
        <div className="stat-card"><h3>Total Bookings</h3><p className="stat-value">{statistics.totalBookings}</p></div>
        <div className="stat-card"><h3>Active Bookings</h3><p className="stat-value">{statistics.activeBookings}</p></div>
        <div className="stat-card"><h3>Total Revenue</h3><p className="stat-value">{statistics.revenue} EGP</p></div>
      </div>

      <div className="admin-content">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            User Management
          </button>
          <button 
            className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => handleTabChange('bookings')}
          >
            Booking Management
          </button>
        </div>

        <div className="admin-tab-content">
          {activeTab === 'users' && (
            <div className="users-table-container">
              <h2>User List</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {user.status === 'active' ? (
                          <button 
                            className="action-button deactivate"
                            onClick={() => handleDeactivateUser(user._id)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button 
                            className="action-button activate"
                            onClick={() => handleActivateUser(user._id)}
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-table-container">
              <h2>Booking List</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th><th>User</th><th>Type</th><th>Title</th>
                    <th>Date & Time</th><th>Location</th><th>Seats</th>
                    <th>Price</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking._id}</td>
                      <td>{booking.userName}</td>
                      <td>{booking.type}</td>
                      <td>{booking.title}</td>
                      <td>{booking.date} at {booking.time}</td>
                      <td>{booking.location}</td>
                      <td>{booking.seats}</td>
                      <td>{booking.price}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        {booking.status === 'upcoming' && (
                          <button 
                            className="action-button cancel"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
