import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be an API call
    const mockUsers = [
      { id: 1, name: 'Ahmed Mohamed', email: 'ahmed.mohamed@example.com', phone: '+20 123 456 7890', joinDate: '15 Jan 2023', status: 'active' },
      { id: 2, name: 'Sara Ahmed', email: 'sara.ahmed@example.com', phone: '+20 123 456 7891', joinDate: '10 Feb 2023', status: 'active' },
      { id: 3, name: 'Mohamed Ali', email: 'mohamed.ali@example.com', phone: '+20 123 456 7892', joinDate: '05 Mar 2023', status: 'inactive' },
      { id: 4, name: 'Fatma Ibrahim', email: 'fatma.ibrahim@example.com', phone: '+20 123 456 7893', joinDate: '20 Apr 2023', status: 'active' },
    ];
    
    const mockBookings = [
      { id: 'TKT-A8C4D3E2', userId: 1, userName: 'Ahmed Mohamed', type: 'Movie', title: 'Movie 4', date: '24 May 2023', time: '7:00 PM', seats: 'D4, D5', location: 'Mokattam', price: '360.00 EGP', status: 'upcoming' },
      { id: 'TKT-B7F1G3H2', userId: 1, userName: 'Ahmed Mohamed', type: 'Theater Show', title: 'Show 1', date: '30 May 2023', time: '7:30 PM', seats: 'C8, C9, C10', location: 'Maadi', price: '750.00 EGP', status: 'upcoming' },
      { id: 'TKT-J5K7L9M1', userId: 2, userName: 'Sara Ahmed', type: 'Movie', title: 'Movie 5', date: '10 Apr 2023', time: '5:30 PM', seats: 'F7, F8', location: 'Tagamo3', price: '360.00 EGP', status: 'completed' },
      { id: 'TKT-N3P6Q8R2', userId: 3, userName: 'Mohamed Ali', type: 'Theater Show', title: 'Show 2', date: '22 Mar 2023', time: '6:45 PM', seats: 'B12, B13', location: 'Madinrt nasr', price: '500.00 EGP', status: 'completed' },
      { id: 'TKT-S4T7U9V1', userId: 4, userName: 'Fatma Ibrahim', type: 'Movie', title: 'Movie 2', date: '15 Feb 2023', time: '9:30 PM', seats: 'G5', location: 'Sheraton', price: '150.00 EGP', status: 'completed' },
      { id: 'TKT-X1Y2Z3A4', userId: 2, userName: 'Sara Ahmed', type: 'Movie', title: 'Movie 3', date: '28 May 2023', time: '8:00 PM', seats: 'A12, A13', location: 'Mokattam', price: '360.00 EGP', status: 'upcoming' },
    ];
    
    setUsers(mockUsers);
    setBookings(mockBookings);
    
    // Calculate statistics
    setStatistics({
      totalUsers: mockUsers.length,
      totalBookings: mockBookings.length,
      activeBookings: mockBookings.filter(booking => booking.status === 'upcoming').length,
      revenue: mockBookings.reduce((total, booking) => total + parseFloat(booking.price), 0).toFixed(2)
    });
  }, []);

  const handleLogout = () => {
    // In a real app, this would clear authentication state
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // In a real app, this would make an API call
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      );
      setBookings(updatedBookings);
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        activeBookings: updatedBookings.filter(booking => booking.status === 'upcoming').length
      }));
      
      alert(`Booking ${bookingId} has been cancelled.`);
    }
  };

  const handleDeactivateUser = (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      // In a real app, this would make an API call
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, status: 'inactive' } 
          : user
      );
      setUsers(updatedUsers);
      alert(`User #${userId} has been deactivated.`);
    }
  };

  const handleActivateUser = (userId) => {
    // In a real app, this would make an API call
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: 'active' } 
        : user
    );
    setUsers(updatedUsers);
    alert(`User #${userId} has been activated.`);
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <div className="admin-logo">
          <img 
            src="/ArtboVard 1@4x.png" 
            alt="Logo" 
            onClick={() => navigate('/')}
            title="Go to Home"
          />
        </div>
        <h1>Admin Dashboard</h1>
        <button className="admin-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{statistics.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-value">{statistics.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Active Bookings</h3>
          <p className="stat-value">{statistics.activeBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">{statistics.revenue} EGP</p>
        </div>
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
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.joinDate}</td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {user.status === 'active' ? (
                          <button 
                            className="action-button deactivate"
                            onClick={() => handleDeactivateUser(user.id)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button 
                            className="action-button activate"
                            onClick={() => handleActivateUser(user.id)}
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
                    <th>Ticket ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Title</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Seats</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
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
                            onClick={() => handleCancelBooking(booking.id)}
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