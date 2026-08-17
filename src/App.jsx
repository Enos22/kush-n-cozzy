import { BrowserRouter, Routes, Route } from "react-router-dom";
import House from "./components/House";
import Login from "./components/login";
import NewProduct from "./pages/NewProduct";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";

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
