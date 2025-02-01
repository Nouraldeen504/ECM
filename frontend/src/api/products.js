// src/api/products.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const productApi = {
  getProducts: async () => {
    const response = await axios.get(`${API_URL}/products/`);
    return response.data;
  },

  getProduct: async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}/`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axios.get(`${API_URL}/categories/`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axios.post(`${API_URL}/products/`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axios.put(`${API_URL}/products/${id}/`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    await axios.delete(`${API_URL}/products/${id}/`);
  }
};