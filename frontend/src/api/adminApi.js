// src/api/adminApi.js
import axiosInstance from './axiosInstance';

const adminApi = {
  // Dashboard
  getDashboardStats: () => {
    return axiosInstance.get('/admin/dashboard_stats/');
  },

  // Products
  getProducts: () => {
    return axiosInstance.get('/products/');
  },
  createProduct: (productData) => {
    return axiosInstance.post('/products/', productData);
  },
  updateProduct: (id, productData) => {
    return axiosInstance.put(`/products/${id}/`, productData);
  },
  deleteProduct: (id) => {
    return axiosInstance.delete(`/products/${id}/`);
  },

  // Users
  getUsers: () => {
    return axiosInstance.get('/users/');
  },
  updateUser: (id, userData) => {
    return axiosInstance.put(`/users/${id}/`, userData);
  },
  deleteUser: (id) => {
    return axiosInstance.delete(`/users/${id}/`);
  },

  // Orders
  getOrders: () => {
    return axiosInstance.get('/orders/');
  },
  updateOrderStatus: (id, status) => {
    return axiosInstance.patch(`/orders/${id}/`, { status });
  },

  // Categories
  getCategories: () => {
    return axiosInstance.get('/categories/');
  },
  createCategory: (data) => {
    return axiosInstance.post('/categories/', data);
  },
  updateCategory: (id, data) => {
    return axiosInstance.put(`/categories/${id}/`, data);
  },
  deleteCategory: (id) => {
    return axiosInstance.delete(`/categories/${id}/`);
  }
};

export default adminApi;