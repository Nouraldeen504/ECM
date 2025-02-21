// src/api/orderApi.js
import axiosInstance from './axiosInstance';

const orderApi = {
 createOrder: (orderData) => {
   return axiosInstance.post('/orders/', orderData);
 },

 getOrders: () => {
   return axiosInstance.get('/orders/');
 },

 getOrder: (id) => {
   return axiosInstance.get(`/orders/${id}/`);
 },

 updateOrderStatus: (id, status) => {
   return axiosInstance.patch(`/orders/${id}/`, { status });
 }
};

export default orderApi;