// src/features/admin/components/OrderDetailsModal.jsx
import { useState, useEffect } from 'react';
import { X, Package, User, MapPin, Calendar, Phone, DollarSign } from 'lucide-react';

export default function OrderDetailsModal({ order, onClose, fetchUser }) {
  const [user, setUser] = useState(null);
  const [loading, setModalLoading] = useState(true);

  useEffect(() => {
    if (order) {
      console.log(order);
      fetchUserDetails(order.user);
    }
  }, [order]);

  const fetchUserDetails = async (userId) => {
    setModalLoading(true);
    try {
      const userData = await fetchUser(userId);
      setUser(userData); 
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Order #{order.order_id}</h2>
            <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                  {loading ? (
                    <p className="text-sm text-gray-900">Loading...</p>
                  ) : user ? (
                    <>
                    <p className="text-sm text-gray-900">{`${user.first_name} ${user.last_name}`}</p>
                    <p className="text-sm text-gray-900">{user.phone}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-900">User not found</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                  <p className="text-sm text-gray-900 whitespace-pre-line">
                    {order.shipping_address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                  <p className="text-sm text-gray-900">
                    {new Date(order.order_date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status and Payment */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment</h3>
                  <p className="text-sm text-gray-900">Total: ${order.total_amount}</p>
                  <p className="text-sm text-gray-500">
                    Method: {order.payment_method || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/*order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.product.image_url || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))*/}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                      Total Amount:
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${order.total_amount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}