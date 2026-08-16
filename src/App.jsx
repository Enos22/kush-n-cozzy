import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import NewProduct from "./pages/NewProduct";
import Footer from "./components/Footer";
import "./App.css";


function App() {
  return (
    <BrowserRouter>
      <nav className="main-nav">
        <Link to="/">Home</Link>
        <Link to="/new-product">Add Product</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-product" element={<NewProduct />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
