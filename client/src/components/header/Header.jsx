import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import User from "../user/user";
import CartWidget from "../cartwidget/cartWidget";

function Header() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo" onClick={goHome}>
        Xperium
      </div>

      <nav className="nav">
        <Link to="/experiencias">Experiencias</Link>
        <Link to="/eventos">Eventos</Link>
        <Link to="/login" className="link-login">
          Iniciar sesión
        </Link>
        <Link to="/register" className="link-register">
          Registrate
        </Link>
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
