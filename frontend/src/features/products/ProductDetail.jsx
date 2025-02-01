// src/features/products/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { productApi } from '../../api/products';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productApi.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.product_id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        quantity
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary hover:text-secondary mb-6"
      >
        <ArrowLeft className="mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <img
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-primary">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.stock_quantity > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-gray-700">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock_quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
              />
            </div>

            {token ? (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-400 hover:bg-gray-500 text-center"
                >
                  <ShoppingCart className="mr-2" />
                  Login to Buy
                </Link>
            )}
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-primary mb-2">Product Details</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.category_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Stock</dt>
                <dd className="mt-1 text-sm text-gray-900">{product.stock_quantity} units</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}