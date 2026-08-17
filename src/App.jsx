import { BrowserRouter, Routes, Route } from 'react-router-dom';
import House from './components/House';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/login';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import NewProduct from './pages/NewProduct';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<House />}>
          <Route index element={<Login />} />
          <Route path="add-product" element={<NewProduct />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
