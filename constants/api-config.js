// API Configuration
// Update the IP address below to match your development server
export const API_CONFIG = {
  // For Android emulator, use 10.0.2.2
  // For iOS simulator, use localhost or 127.0.0.1
  // For physical device, use your computer's IP address (e.g., 192.168.1.100)
  BASE_URL: 'http://192.168.100.30:3000/api', // Default for Android emulator
  
  // Alternative configurations:
  // BASE_URL: 'http://192.168.1.100:3000/api', // For physical device (update IP)
  // BASE_URL: 'http://localhost:3000/api', // For iOS simulator
  
  TIMEOUT: 10000, // 10 seconds timeout
};

// Helper function to get the full endpoint URL
export const getEndpoint = (path) => `${API_CONFIG.BASE_URL}${path}`;

export default API_CONFIG;
