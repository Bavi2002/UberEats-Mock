import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMenuItemsByRestaurant } from "../services/restaurentServices";
import { addToCart } from "../services/userServices";
import {
  AlertCircle,
  CheckCircle,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";

function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        const data = await getMenuItemsByRestaurant(id);
        setMenuItems(data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load menu items");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuItems();
  }, [id]);

  const handleQuantityChange = (itemId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, parseInt(value) || 1),
    }));
  };

  const handleAddToCart = async (item) => {
    setError("");
    setSuccess("");
    try {
      const quantity = quantities[item._id] || 1;
      await addToCart({
        restaurant: id,
        menuItem: item._id,
        quantity,
        price: item.price,
      });
      setSuccess(`${item.name} added to cart!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add item to cart");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Menu</h2>
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-600 p-4 rounded-lg mb-8 flex items-center gap-3"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle size={20} className="text-red-600" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div
          className="bg-green-100 border-l-4 border-green-600 p-4 rounded-lg mb-8 flex items-center gap-3"
          role="alert"
          aria-live="assertive"
        >
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
          aria-busy="true"
          aria-label="Loading menu items"
        >
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 p-4 rounded-lg"
            >
              <div className="h-56 w-full bg-gray-100 rounded-md mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-100 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <div className="bg-white border border-gray-100 p-6 rounded-lg text-center mt-6">
          <p className="text-gray-600 text-sm mb-4">
            No menu items available. Browse other restaurants!
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            aria-label="Browse restaurants"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Restaurants
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-100 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <img
                src={
                  item.image
                    ? `${import.meta.env.VITE_API_RESTAURANT_BASE_URL}${
                        item.image
                      }`
                    : "https://via.placeholder.com/300x224?text=No+Image"
                }
                alt={item.name}
                className="w-full h-56 object-cover rounded-md mb-4"
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x224?text=No+Image";
                }}
              />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {item.name}
                </h3>
                <p className="text-sm font-medium text-gray-600">
                  ${item.price.toFixed(2)}
                </p>
                <p className="text-sm font-medium text-gray-600 capitalize truncate">
                  {item.category}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {item.description}
                </p>
                <p
                  className={`text-sm font-medium ${
                    item.isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </p>
              </div>
              {item.isAvailable && (
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={quantities[item._id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(item._id, e.target.value)
                    }
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-4 py-1 bg-black text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-balck transition-colors duration-200"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/cart")}
          className="inline-flex items-center px-12 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          aria-label="View cart"
        >
          <ShoppingCart size={16} className="mr-2" />
          View Cart
        </button>
      </div>
    </div>
  );
}

export default RestaurantPage;
