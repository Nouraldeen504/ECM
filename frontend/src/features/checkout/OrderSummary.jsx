// src/features/checkout/OrderSummary.jsx
export default function OrderSummary({ items, total, shippingDetails }) {
  const shippingCost = 10;
  const tax = total * 0.1;
  const finalTotal = total + shippingCost + tax;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={item.image || '/placeholder-product.jpg'}
                alt={item.name}
                className="h-16 w-16 object-cover rounded"
              />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <p>Subtotal</p>
          <p>${total.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <p>Shipping</p>
          <p>${shippingCost.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <p>Tax</p>
          <p>${tax.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-base font-medium text-gray-900 pt-2 border-t">
          <p>Total</p>
          <p>${finalTotal.toFixed(2)}</p>
        </div>
      </div>

      {shippingDetails && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-900">Shipping Address</h3>
          <address className="mt-2 text-sm text-gray-600 not-italic">
            {shippingDetails.firstName} {shippingDetails.lastName}<br />
            {shippingDetails.address}<br />
            {shippingDetails.city}, {shippingDetails.postalCode}
          </address>
        </div>
      )}
    </div>
  );
}