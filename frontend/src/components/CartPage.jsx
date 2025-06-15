import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../services/userServices";

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: "",
    countryCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [addressErrors, setAddressErrors] = useState({});

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const data = await getCart();
        setCart(data.data || []);
      } catch (err) {
        setError(err.message || "Failed to load cart");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    setAddressErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateAddress = useCallback(() => {
    const errors = {};
    if (!address.street.trim()) errors.street = "Street address is required";
    if (!address.city.trim()) errors.city = "City is required";
    if (!address.state.trim()) errors.state = "State is required";
    if (!address.zipcode.trim()) errors.zipcode = "Zipcode is required";
    if (!address.countryCode.trim())
      errors.countryCode = "Country code is required";
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  }, [address]);

  const handleCheckout = () => {
    if (!validateAddress()) return;

    if (paymentMethod === "cod") {
      navigate("/checkout", {
        state: { cart, address, paymentMethod },
      });
    } else {
      navigate("/payment", {
        state: { cart, address, paymentMethod },
      });
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="space-y-4">
            <div className="h-6 bg-gray-100 rounded w-1/2"></div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-100 rounded w-16"></div>
            </div>
          </div>
        </div>
      ) : cart.length === 0 ? (
        <p className="text-gray-600 text-sm">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              {cart.map((item) => (
                <div
                  key={item.menuItem}
                  className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
                >
                  <img
                    src={
                      item.image
                        ? `${import.meta.env.VITE_API_RESTAURANT_BASE_URL}${
                            item.image
                          }`
                        : "https://via.placeholder.com/100x100?text=No+Image"
                    }
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <p className="text-gray-800 font-semibold text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="p-6 text-right">
                <p className="text-lg font-semibold text-gray-800">
                  Total: ${total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Delivery Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Street Address
                  </label>
                  <input
                    id="street"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      addressErrors.street
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="123 Main St"
                    aria-invalid={!!addressErrors.street}
                    aria-describedby={
                      addressErrors.street ? "street-error" : undefined
                    }
                  />
                  {addressErrors.street && (
                    <p id="street-error" className="mt-1 text-sm text-red-600">
                      {addressErrors.street}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      addressErrors.city ? "border-red-500" : "border-gray-300"
                    } bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="New York"
                    aria-invalid={!!addressErrors.city}
                    aria-describedby={
                      addressErrors.city ? "city-error" : undefined
                    }
                  />
                  {addressErrors.city && (
                    <p id="city-error" className="mt-1 text-sm text-red-600">
                      {addressErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      addressErrors.state ? "border-red-500" : "border-gray-300"
                    } bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="NY"
                    aria-invalid={!!addressErrors.state}
                    aria-describedby={
                      addressErrors.state ? "state-error" : undefined
                    }
                  />
                  {addressErrors.state && (
                    <p id="state-error" className="mt-1 text-sm text-red-600">
                      {addressErrors.state}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="zipcode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Zipcode
                  </label>
                  <input
                    id="zipcode"
                    name="zipcode"
                    value={address.zipcode}
                    onChange={handleAddressChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      addressErrors.zipcode
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="10001"
                    aria-invalid={!!addressErrors.zipcode}
                    aria-describedby={
                      addressErrors.zipcode ? "zipcode-error" : undefined
                    }
                  />
                  {addressErrors.zipcode && (
                    <p id="zipcode-error" className="mt-1 text-sm text-red-600">
                      {addressErrors.zipcode}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="countryCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country Code
                  </label>
                  <input
                    id="countryCode"
                    name="countryCode"
                    value={address.countryCode}
                    onChange={handleAddressChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      addressErrors.countryCode
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="US"
                    aria-invalid={!!addressErrors.countryCode}
                    aria-describedby={
                      addressErrors.countryCode
                        ? "countryCode-error"
                        : undefined
                    }
                  />
                  {addressErrors.countryCode && (
                    <p
                      id="countryCode-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {addressErrors.countryCode}
                    </p>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                Payment Method
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Cash on Delivery
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Pay Now (Stripe)
                  </span>
                </label>
              </div>
              <button
                onClick={handleCheckout}
                className="mt-6 w-full px-6 py-3 bg-black text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
                disabled={isLoading}
              >
                {paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
