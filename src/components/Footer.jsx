import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3 className="footer-mark">
            Kush-n-<span>Cozzy</span>
          </h3>
          <p className="footer-tagline">your cozy corner store</p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li>
              <Link to="/">Electronics</Link>
            </li>
            <li>
              <Link to="/">Clothes</Link>
            </li>
            <li>
              <Link to="/">Beauty Products</Link>
            </li>
            <li>
              <Link to="/">Gift Products</Link>
            </li>
            <li>
              <Link to="/">Furniture</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Store</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/add-product">Add Product</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Kush-n-Cozzy. All rights Claimed And Reserved By Team 9.</p>
      </div>
    </footer>
  );
}

export default Footer;

