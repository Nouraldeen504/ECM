// src/features/admin/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import adminApi from '../../../api/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">{trend}% this month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Total Users" 
          value={stats.totalUsers} 
          trend={12}
        />
        <StatCard 
          icon={Package} 
          label="Total Products" 
          value={stats.totalProducts}
        />
        <StatCard 
          icon={ShoppingBag} 
          label="Total Orders" 
          value={stats.totalOrders} 
          trend={8}
        />
        <StatCard 
          icon={DollarSign} 
          label="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          trend={15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Low Stock Products</h2>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{product.stock} units</p>
                  <p className="text-sm text-red-500">Low stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}