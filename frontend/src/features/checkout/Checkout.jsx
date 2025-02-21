// src/features/checkout/Checkout.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/slices/cartSlice';
import { Truck, CheckCircle } from 'lucide-react';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import axiosInstance from '../../api/axiosInstance';
import orderApi from '../../api/orderApi';


export default function Checkout() {
  const [step, setStep] = useState(1);
  const [shippingDetails, setShippingDetails] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/users/profile/');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleShippingSubmit = async (data) => {
    try {
      const orderData = {
        shipping_address: `${data.address}, ${data.city}, ${data.postalCode}`,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        payment_method: 'COD'
      };

      // Call  API to create order
      console.log(orderData)
      const response = await orderApi.createOrder(orderData);
      setShippingDetails(data);
      setStep(2);

      // Clear cart and redirect after short delay
      setTimeout(() => {
        dispatch(clearCart());
        navigate('/order-confirmation');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  // const handlePaymentSubmit = async (paymentDetails) => {
  //   try {
  //     // TODO: Process payment with backend
  //     setStep(3);
  //     setTimeout(() => {
  //       dispatch(clearCart());
  //       navigate('/');
  //     }, 3000);
  //   } catch (error) {
  //     console.error('Payment failed:', error);
  //   }
  // };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          {step === 1 ? (
            <CheckoutForm onSubmit={handleShippingSubmit} user={currentUser} />
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-2xl font-medium text-gray-900">
                Order Confirmed!
              </h2>
              <p className="mt-2 text-gray-600">
                Thank you for your order. <br /> We'll deliver it to your address within 3 business days.
                <br />Check your email for tracking your order!
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <OrderSummary 
          items={items} 
          total={total} 
          shippingDetails={shippingDetails}
        />
      </div>
    </div>
  );
}
