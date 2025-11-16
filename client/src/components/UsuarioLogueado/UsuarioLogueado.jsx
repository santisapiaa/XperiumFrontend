"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../../redux/authSlice";

function UsuarioLogueado() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    alert("👋 Sesión cerrada correctamente");
    navigate("/login");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "15px",
        right: "15px",
        backgroundColor: "#f3f3f3",
        padding: "10px 15px",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: "500",
      }}
    >
      👋 Hola, {user.nombre}
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#ff4b4b",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default UsuarioLogueado;
