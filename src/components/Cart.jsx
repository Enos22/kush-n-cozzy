import { Link } from "react-router-dom";
import { useCart } from "../CartContext";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page cart-empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <ul className="cart-list">
        {cartItems.map((item) => (
          <li key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-img" />
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>KES {item.price.toLocaleString()}</p>
            </div>
            <div className="cart-item-qty">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <p className="cart-item-subtotal">
              KES {(item.price * item.quantity).toLocaleString()}
            </p>
            <button
              className="cart-remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <h3>Total: KES {totalPrice.toLocaleString()}</h3>
        <Link to="/checkout" className="btn btn-checkout">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;
