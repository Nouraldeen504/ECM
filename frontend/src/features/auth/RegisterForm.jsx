// src/features/auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { authApi } from '../../api/auth';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    password1: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    // Required fields
    if (!formData.email) errors.email = 'Email is required.';
    if (!formData.username) errors.username = 'Username is required.';
    if (!formData.first_name) errors.first_name = 'First name is required.';
    if (!formData.last_name) errors.last_name = 'Last name is required.';
    if (!formData.phone) errors.phone = 'Phone number is required.';
    if (!formData.password1) errors.password1 = 'Password is required.';
    if (!formData.password2) errors.password2 = 'Confirm password is required.';

    // Email format validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format.';
    }

    // Password matching validation
    if (formData.password1 && formData.password2 && formData.password1 !== formData.password2) {
      errors.password2 = 'Passwords do not match.';
    }

    // Phone number validation (must start with + and have country code and number)
    if (formData.phone && !/^\+\d{1,4}\s?\d{6,14}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be in the format: + (country code) (number).';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form before submission
    if (!validateForm()) return;

    try {
      console.log(formData);
      const data = await authApi.register({
        email: formData.email,
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        password1: formData.password1,
        password2: formData.password2,
      });

      console.log('Registration response:', data);
      dispatch(setCredentials(data));
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      const errorMessage =
        error.response?.data?.detail ||
        Object.values(error.response?.data || {})[0]?.[0] ||
        'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-primary text-center">Register</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email */}
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              {validationErrors.username && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
              {validationErrors.first_name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
              {validationErrors.last_name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.last_name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10"
                placeholder="Phone Number (e.g., +1 1234567890)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10"
                placeholder="Password"
                value={formData.password1}
                onChange={(e) => setFormData({ ...formData, password1: e.target.value })}
              />
              {validationErrors.password1 && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password1}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
              />
              {validationErrors.password2 && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.password2}</p>
              )}
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            Register
          </button>
        </form>

        {/* Already a registered user? Login */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already a registered user?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-secondary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}