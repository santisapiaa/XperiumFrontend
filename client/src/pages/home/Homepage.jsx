import Header from "../../components/header/Header";
import Carousel from "../../components/carousel/Carousel";
import "./Homepage.css";
import UsuarioLogueado from "../../components/UsuarioLogueado/UsuarioLogueado";

function Homepage() {
  return (
    <div className="homepage">
      <UsuarioLogueado /> {/* ✅ Muestra el saludo y el botón */}
      <Header />
      <Carousel />
    </div>
  );
}

export default Homepage;
