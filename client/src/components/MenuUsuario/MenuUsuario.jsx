import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MenuUsuario({ onClose }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioLogueado");
    if (usuarioGuardado) {
      const datosUsuario = JSON.parse(usuarioGuardado);
      setUsuario(datosUsuario);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogueado");
    alert("👋 Sesión cerrada correctamente");
    navigate("/login");
    if (onClose) onClose();
  };

  const handlePerfil = () => {
    navigate("/perfil");
    if (onClose) onClose();
  };

  // Si no hay usuario logueado, no mostramos nada
  if (!usuario) return null;

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
        Hola, {usuario.nombre}
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
