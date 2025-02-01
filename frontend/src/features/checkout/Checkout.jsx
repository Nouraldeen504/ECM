// src/features/checkout/Checkout.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/slices/cartSlice';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [shippingDetails, setShippingDetails] = useState(null);
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShippingSubmit = (data) => {
    setShippingDetails(data);
    setStep(2);
  };

  const handlePaymentSubmit = async (paymentDetails) => {
    try {
      // TODO: Process payment with backend
      setStep(3);
      setTimeout(() => {
        dispatch(clearCart());
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Checkout Steps */}
      <nav className="flex items-center justify-center mb-8">
        <ol className="flex items-center space-x-4">
          <li className="flex items-center">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-secondary text-white' : 'bg-gray-200'
            }`}>
              <Truck className="w-5 h-5" />
            </span>
            <span className="ml-2 text-sm font-medium">Shipping</span>
          </li>
          <li className="flex items-center">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-secondary text-white' : 'bg-gray-200'
            }`}>
              <CreditCard className="w-5 h-5" />
            </span>
            <span className="ml-2 text-sm font-medium">Payment</span>
          </li>
          <li className="flex items-center">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step === 3 ? 'bg-secondary text-white' : 'bg-gray-200'
            }`}>
              <CheckCircle className="w-5 h-5" />
            </span>
            <span className="ml-2 text-sm font-medium">Confirmation</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          {step === 1 && (
            <CheckoutForm onSubmit={handleShippingSubmit} />
          )}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-medium text-gray-900">Payment Details</h2>
              <PaymentForm
                amount={total}
                onSuccess={() => {
                  setStep(3);
                  setTimeout(() => {
                    dispatch(clearCart());
                    navigate('/');
                  }, 3000);
                }}
              />
            </div>
          )}
          {step === 3 && (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h2 className="mt-4 text-2xl font-medium text-gray-900">
                Order Confirmed!
              </h2>
              <p className="mt-2 text-gray-600">
                Thank you for your order. We'll send you shipping updates via email.
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <OrderSummary items={items} total={total} shippingDetails={shippingDetails} />
      </div>
    </div>
  );
}
