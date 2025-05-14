// Try potential server ports
let API_BASE_URL = 'http://localhost:5001/api';

// Function to check if the server is running
export const checkServerStatus = async () => {
  // Try ports in sequence: 5001, 5002, 5003
  const ports = [5001, 5002, 5003];
  
  for (const port of ports) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`http://localhost:${port}/`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      API_BASE_URL = `http://localhost:${port}/api`;
      console.log(`Connected to server on port ${port}`);
      return { success: true, data, connected: true };
    } catch (error) {
      console.log(`Server not available on port ${port}, trying next port...`, error.message);
      // Continue to next port
    }
  }
  
  // If we get here, all ports failed
  console.error('Server connection error on all ports');
  return { 
    success: false, 
    error: 'Connection timeout. Server may be down.', 
    connected: false 
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJSON = JSON.parse(errorText);
      return { success: false, error: errorJSON.message || 'Server error' };
    } catch {
      return { success: false, error: errorText || 'Server error' };
    }
  }
  
  const data = await response.json();
  return { success: true, data };
};

// Helper function for API requests with timeout and retry
const makeRequest = async (url, options = {}, retries = 2) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timeout:', url);
      return { success: false, error: 'Request timeout. Please try again.' };
    }
    
    if (retries > 0) {
      console.log(`Retrying request to ${url}. Retries left: ${retries}`);
      return makeRequest(url, options, retries - 1);
    }
    
    return { success: false, error: error.message };
  }
};

// Movie API Functions
export const getAllMovies = async () => {
  return await makeRequest(`${API_BASE_URL}/movies`);
};

export const getShowingMovies = async () => {
  return await makeRequest(`${API_BASE_URL}/movies/showing`);
};

export const getMovieById = async (movieId) => {
  return await makeRequest(`${API_BASE_URL}/movies/${movieId}`);
};

export const getMoviesByGenre = async (genre) => {
  return await makeRequest(`${API_BASE_URL}/movies/genre/${genre}`);
};

// Theater API Functions
export const getAllTheaters = async () => {
  return await makeRequest(`${API_BASE_URL}/theaters`);
};

export const getTheaterById = async (theaterId) => {
  return await makeRequest(`${API_BASE_URL}/theaters/${theaterId}`);
};

// User API Functions
export const loginUser = async (credentials) => {
  try {
    const response = await makeRequest(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (response.success) {
      // Save token and user info to local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set isAdmin flag based on user role
      localStorage.setItem('isAdmin', response.data.user.role === 'admin' ? 'true' : 'false');
    }
    
    return response;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const registerUser = async (userData) => {
  return await makeRequest(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isAdmin');
  return { success: true };
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Booking API Functions - Updated to use design patterns
export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }
    
    // Prepare booking data with decorator options
    const enhancedBookingData = {
      movie: bookingData.movie,
      theater: bookingData.theater,
      showtime: bookingData.showtime,
      seats: bookingData.seats,
      paymentMethod: bookingData.paymentMethod,
      paymentDetails: bookingData.paymentDetails,
      // Decorator pattern options
      isVIP: bookingData.isVIP || false,
      foodOptions: bookingData.foodOptions || [],
      parkingPass: bookingData.parkingPass || false
    };
    
    return await makeRequest(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(enhancedBookingData),
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserBookings = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }
    
    return await makeRequest(`${API_BASE_URL}/bookings/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }
    
    return await makeRequest(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Payment API Functions
export const getPaymentMethods = async () => {
  return await makeRequest(`${API_BASE_URL}/payments/methods`);
};

export const processPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }
    
    return await makeRequest(`${API_BASE_URL}/payments/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData),
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
}; 