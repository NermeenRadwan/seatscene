const API_BASE_URL = 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/users`,
  USER_PROFILE: `${API_BASE_URL}/users/profile`,
  
  // Movie endpoints
  MOVIES: `${API_BASE_URL}/movies`,
  
  // Theater endpoints
  THEATERS: `${API_BASE_URL}/theaters`,
  
  // Booking endpoints
  BOOKINGS: `${API_BASE_URL}/bookings`,
  
  // Payment endpoints
  PAYMENTS: `${API_BASE_URL}/payments`,
};

export const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token ? { Authorization: `Bearer ${user.token}` } : {};
}; 