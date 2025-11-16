"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../../redux/authSlice";

function MenuUsuario({ onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    alert("👋 Sesión cerrada correctamente");
    navigate("/login");
    if (onClose) onClose();
  };

  const handlePerfil = () => {
    navigate("/perfil");
    if (onClose) onClose();
  };

  const handleCompras = () => {
    navigate("/compras");
    if (onClose) onClose();
  };

  const handleLogin = () => {
    navigate("/login");
    if (onClose) onClose();
  };

  const handleRegister = () => {
    navigate("/register");
    if (onClose) onClose();
  };

  if (!user) {
    return (
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: "0",
          zIndex: "999",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          width: "180px",
          padding: "10px 0",
        }}
      >
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            border: "none",
            background: "none",
            padding: "10px 15px",
            textAlign: "left",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          🔐 Iniciar sesión
        </button>
        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            border: "none",
            background: "none",
            padding: "10px 15px",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          📝 Registrate
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        right: "0",
        zIndex: "999",
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        width: "180px",
        padding: "10px 0",
      }}
    >
      <p
        style={{
          margin: "0",
          padding: "8px 15px",
          fontWeight: "500",
          borderBottom: "1px solid #eee",
        }}
      >
        Hola, {user.nombre}
      </p>
      <button
        onClick={handlePerfil}
        style={{
          width: "100%",
          border: "none",
          background: "none",
          padding: "10px 15px",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        👀 Ver perfil
      </button>
      <button
        onClick={handleCompras}
        style={{
          width: "100%",
          border: "none",
          background: "none",
          padding: "10px 15px",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        🛍️ Mis compras
      </button>
      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          border: "none",
          background: "none",
          padding: "10px 15px",
          textAlign: "left",
          cursor: "pointer",
          color: "red",
        }}
      >
        🚪 Cerrar sesión
      </button>
    </div>
  );
}

export default MenuUsuario;
