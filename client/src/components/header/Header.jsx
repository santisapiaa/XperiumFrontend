import React from "react";
import "./Header.css";

function Header() {
  const goHome = () => {
    window.location.href = "/"; // redirige al inicio
  };

  return (
    <header className="header">
      <div className="logo" onClick={goHome}>
        bigbox
      </div>

      <nav className="nav">
        <a href="/gifts">Regalos</a>
        <a href="#actividades">Actividades</a>
        <a href="#eventos">Eventos</a>
        <a href="#mas-vendidos">Más vendidos</a>
      </nav>

      <div className="actions">
        <input type="text" placeholder="Buscar experiencias..." />
        <button className="btn-regalo">Abrir regalo</button>
      </div>
    </header>
  );
}

export default Header;
