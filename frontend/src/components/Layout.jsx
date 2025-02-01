// src/components/Layout.jsx
import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload()
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-white font-bold text-xl">
              Optech
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/cart" className="text-white hover:text-accent relative">
                <ShoppingCart className="h-6 w-6" />
                {items?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {items.length}
                  </span>
                )}
              </Link>
              {token ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="text-white hover:text-accent">
                    <User className="h-6 w-6" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-accent"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-accent">
                    Login
                  </Link>
                  <Link to="/register" className="text-white hover:text-accent">
                    Register
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-accent"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/cart"
                className="text-white block px-3 py-2 rounded-md hover:bg-secondary"
              >
                Cart ({items?.length || 0})
              </Link>
              {token ? (
                <>
                  <Link
                    to="/profile"
                    className="text-white block px-3 py-2 rounded-md hover:bg-secondary"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white block w-full text-left px-3 py-2 rounded-md hover:bg-secondary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white block px-3 py-2 rounded-md hover:bg-secondary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white block px-3 py-2 rounded-md hover:bg-secondary"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}