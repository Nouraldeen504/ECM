// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRoute';
import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';
import Cart from './features/cart/Cart';
import Checkout from './features/checkout/Checkout';
import Profile from './features/profile/Profile';
import AdminLayout from './features/admin/AdminLayout';
import AdminDashboard from './features/admin/components/AdminDashboard';
import AdminProducts from './features/admin/components/AdminProducts'; 
import AdminUsers from './features/admin/components/AdminUsers';
import AdminOrders from './features/admin/components/AdminOrders';
import OrderConfirmation from './features/checkout/OrderConfirmation';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route element={<Layout />}>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
            </Route>
          </Route>

          <Route element={<AdminPrivateRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
              {/*<Route path="settings" element={<AdminSettings />} /> */}
            </Route>
          </Route>  
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;