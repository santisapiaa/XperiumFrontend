"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function UsuarioLogueado() {
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()

  // Al cargar el componente, leemos el usuario guardado
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioLogueado")
    if (usuarioGuardado) {
      const datosUsuario = JSON.parse(usuarioGuardado)
      setUsuario(datosUsuario)
    }
  }, [])

  // Si no hay usuario logueado, no mostramos nada
  if (!usuario) return null

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuarioLogueado")
    alert("👋 Sesión cerrada correctamente")
    navigate("/login") // vuelve al login
  }

  // Renderizamos el saludo y el botón de cerrar sesión
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
      👋 Hola, {usuario.nombre}
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
  )
}

export default UsuarioLogueado
