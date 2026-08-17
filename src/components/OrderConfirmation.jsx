import { Link } from "react-router-dom";

function OrderConfirmation() {
  return (
    <div className="order-confirmation-page">
      <h2>Order Placed!</h2>
      <p>
        Thanks for shopping with us. Your order has been received and is
        being processed.
      </p>
      <p>You'll get a confirmation call or message shortly.</p>
      <Link to="/" className="btn">
        Back to Home
      </Link>
    </div>
  );
}

export default OrderConfirmation;
