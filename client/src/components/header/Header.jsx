import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import User from "../user/user";
import CartWidget from "../cartwidget/cartWidget";

function Header() {
  const goHome = () => {
    window.location.href = "/"; // redirige al inicio
  };

  return (
    <header className="header">
      <div className="logo" onClick={goHome}>
        Xperium
      </div>

      <nav className="nav">
        <Link to="/regalos">Regalos</Link>
        <a href="#actividades">Actividades</a>
        <a href="#eventos">Eventos</a>
        <a href="#mas-vendidos">Más vendidos</a>
      </nav>

      <div className="actions">
        <input type="text" placeholder="Buscar experiencias..." />
        <button className="btn-regalo">Abrir regalo</button>
      </div>
      <div className="actions">
        <User />
        <Link to="/carrito">
          <CartWidget />
        </Link>
      </div>
    </header>
  );
}

export default Header;
