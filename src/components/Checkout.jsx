import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";

// Use VITE_API_URL when provided, otherwise default to local json-server on port 4000
const ORDERS_ENDPOINT = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/orders`
  : "http://localhost:4000/orders";

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "cash",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage("");

    const order = {
      customer: form,
      items: cartItems,
      total: totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(ORDERS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Failed to place order");

      setSuccessMessage("Order placed successfully! Redirecting to confirmation...");
      clearCart();
      setTimeout(() => {
        navigate("/order-confirmation");
      }, 1000);
    } catch (err) {
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <h2>Your cart is empty</h2>
        <p>Add items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} x{item.quantity} — KES{" "}
              {(item.price * item.quantity).toLocaleString()}
            </li>
          ))}
        </ul>
        <p className="checkout-total">
          <strong>Total: KES {totalPrice.toLocaleString()}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="0712 345 678"
            required
          />
        </label>

        <label>
          Delivery Address
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your delivery address"
            required
          />
        </label>

        <label>
          Payment Method
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option value="cash">Cash on Delivery</option>
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
          </select>
        </label>

        {error && <p className="checkout-error">{error}</p>}
        {successMessage && (
          <p style={{ color: "green", fontWeight: 700, marginTop: 12 }}>
            {successMessage}
          </p>
        )}

        <button type="submit" className="btn btn-checkout" disabled={submitting}>
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
