import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/home/Homepage";
import Regalospage from "./pages/regalos/Regalospage";
import Eventospage from "./pages/eventos/Eventospage";
import Cartpage from "./pages/cart/Cartpage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/login/RegisterPage";
import RegisterProveedorPage from "./pages/login/RegisterProveedorPage";
import Footer from "./components/footer/Footer";
import PerfilPage from "./pages/perfil/PerfilPage";
import ComprasPage from "./pages/compras/ComprasPage";
import ProveedorPage from "./pages/proveedor/ProveedorPage";
import DetalleOrdenPage from "./pages/detalleOrden/DetalleOrdenPage";
import ProductDetailPage from "./pages/productDetail/ProductDetailPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/experiencias" element={<Regalospage />} />
            <Route path="/eventos" element={<Eventospage />} />
            <Route path="/carrito" element={<Cartpage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/compras" element={<ComprasPage />} />
            <Route path="/compras/:id" element={<DetalleOrdenPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/register-proveedor"
              element={<RegisterProveedorPage />}
            />
            <Route path="/proveedor" element={<ProveedorPage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
