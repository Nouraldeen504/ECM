// src/features/cart/Cart.jsx
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';

export default function Cart() {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-gray-500">
          Start shopping to add items to your cart
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="px-4 py-6 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
        <div className="mt-8">
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="py-6 flex">
                  <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link to={`/products/${item.id}`}>{item.name}</Link>
                        </h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <div className="flex items-center">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                          className="p-1 text-gray-400 hover:text-gray-500"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2 text-gray-600">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="p-1 text-gray-400 hover:text-gray-500"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to remove this item your cart?')) {
                            dispatch(clearCart(removeFromCart(item.id)));
                          }
                        }}
                        className="font-medium text-red-600 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${total.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
        <div className="mt-4">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your cart?')) {
                dispatch(clearCart());
              }
            }}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Clear Cart
          </button>
        </div>
        <div className="mt-6">
          <Link
            to="/checkout"
            className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            Checkout
          </Link>
        </div>
        <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
          <p>
            or{' '}
            <Link
              to="/"
              className="text-secondary hover:text-primary font-medium"
            >
              Continue Shopping
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}