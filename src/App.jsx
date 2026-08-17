import { BrowserRouter, Routes, Route } from 'react-router-dom';
import House from './components/House';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/login';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import NewProduct from './pages/NewProduct';
import NotFound from './pages/NotFound';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<House />}>
          <Route index element={<ProductList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="add-product" element={<NewProduct />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;