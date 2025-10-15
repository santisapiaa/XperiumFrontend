import React from "react";
import Header from "../../components/header/Header";
import Carousel from "../../components/carousel/Carousel";
import Footer from "../../components/footer/Footer";
import "./Homepage.css";
import UsuarioLogueado from "../../components/UsuarioLogueado/UsuarioLogueado";
import MenuUsuario from "../../components/MenuUsuario/MenuUsuario";

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
