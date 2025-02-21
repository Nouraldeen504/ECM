// src/features/checkout/OrderConfirmation.jsx
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrderConfirmation() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p className="mt-2 text-lg text-gray-600">
          Thank you for your order. We'll deliver it to your address within 3 business days.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Payment will be collected upon delivery.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          If you think there's a problem, please don't hesitate to contact us at <a className='text-blue-600' href="mailto:info@optech.ly">info@optech.ly</a>
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}