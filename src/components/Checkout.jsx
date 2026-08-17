import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";

// Point this at your json-server instance, e.g. "http://localhost:3001/orders"
const ORDERS_ENDPOINT = "http://localhost:3001/orders";

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

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

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

      clearCart();
      navigate("/order-confirmation");
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
            required
          />
        </label>

        <label>
          Delivery Address
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
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

        <button type="submit" className="btn btn-checkout" disabled={submitting}>
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
