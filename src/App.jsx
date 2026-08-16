import { BrowserRouter, Routes, Route } from "react-router-dom";
import House from "./components/House";
import Login from "./components/login";
import NewProduct from "./pages/NewProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<House />}>
          <Route index element={<Login />} />
          <Route path="add-product" element={<NewProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
