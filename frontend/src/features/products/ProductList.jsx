// src/features/products/ProductList.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { productApi } from '../../api/products';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productApi.getProducts(),
          productApi.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === parseInt(selectedCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.product_id,
      name: product.name,
      price: product.price,
      image: product.image_url
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-gray-400" />
          <select
            className="w-full md:w-48 py-2 pl-3 pr-10 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.product_id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link to={`/products/${product.product_id}`}>
              <img
                src={product.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4 space-y-2">
              <Link to={`/products/${product.product_id}`} className="block">
                <h3 className="text-lg font-semibold text-primary hover:text-secondary truncate">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  ${Number(product.price).toFixed(2)}
                </span>
                {token ? (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors"
                    >
                    Add to Cart
                  </button>
                  ) : (
                    <Link
                      to="/login"
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors"
                    >
                      Login to Buy
                    </Link>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
