// src/features/profile/Profile.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Package, ShoppingBag, User } from 'lucide-react';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/users/profile/');
        console.log('Profile response:', response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data);
      }
    };

      const fetchOrders = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/orders/', {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };

    fetchProfile();
    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-primary rounded-full p-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Profile</h2>
            </div>
            {profileData && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{profileData.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Username</label>
                  <p className="font-medium">{profileData.username}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{profileData.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="font-medium">{profileData.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-secondary rounded-full p-3">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Order History</h2>
            </div>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <div key={index + 1} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Order #{index + 1}</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.order_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      Total: ${order.total_amount}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="text-gray-500">Start shopping to see your orders here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}