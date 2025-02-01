// src/components/AdminPrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminPrivateRoute() {
  const { user } = useSelector((state) => state.auth);

  // Check if user is authenticated and has the admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />; // Redirect to home page or login page
  }

  // Allow access to admin routes
  return <Outlet />;
}