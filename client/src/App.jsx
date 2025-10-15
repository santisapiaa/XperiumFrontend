import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/home/Homepage";
import Regalospage from "./pages/regalos/Regalospage";
import Cartpage from "./pages/cart/Cartpage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/login/RegisterPage";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
  <Route path="/regalos" element={<Regalospage />} />
  <Route path="/carrito" element={<Cartpage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
