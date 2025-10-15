import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./userIcon.png";
import "./user.css";

const User = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (usuario) {
      // Si está logueado, lo llevamos a perfil (ruta de ejemplo)
      navigate("/profile");
    } else {
      // Si no está logueado, llevar a login
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="ContainerLogoUser">
        <button
          onClick={handleClick}
          className="user-button"
          aria-label="Ir a usuario"
        >
          <img className="UserIcon" src={logo} alt="user icon" />
        </button>
      </div>
    </div>
  );
};

export default User;
