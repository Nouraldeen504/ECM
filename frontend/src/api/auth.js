// src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login/', {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      console.log('Sending registration data:', userData);
      const response = await axiosInstance.post('/auth/registration/', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Full registration error:', error);
      console.error('Response data:', error.response?.data);
      throw error;
    }
  }
};