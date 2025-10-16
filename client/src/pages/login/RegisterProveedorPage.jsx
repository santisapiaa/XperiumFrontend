"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../login/LoginPage.css"
import { authAPI } from "../../services/api"

function RegisterProveedorPage() {
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    contrasenia: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    if (!userData.nombre || !userData.email || !userData.telefono || !userData.contrasenia) {
      setError("Por favor, completá todos los campos.")
      return
    }

    if (userData.contrasenia !== userData.confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)

    try {
      const nuevoProveedor = {
        nombre: userData.nombre,
        email: userData.email,
        telefono: userData.telefono,
        contrasenia: userData.contrasenia,
      }

      await authAPI.registerProveedor(nuevoProveedor)

      alert("Proveedor registrado correctamente.")
      navigate("/login")
    } catch (error) {
      console.error("Error al registrar proveedor:", error)
      setError(error.message || "Error al registrar proveedor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Registrarse como Vendedor</h1>

        {error && (
          <div
            style={{
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "16px",
              color: "#c33",
              fontSize: "14px",
              whiteSpace: "pre-line",
            }}
          >
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleRegister}>
          <input type="text" name="nombre" placeholder="Nombre" value={userData.nombre} onChange={handleChange} />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={userData.email}
            onChange={handleChange}
          />
          <input type="tel" name="telefono" placeholder="Teléfono" value={userData.telefono} onChange={handleChange} />
          <input
            type="password"
            name="contrasenia"
            placeholder="Contraseña"
            value={userData.contrasenia}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={userData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarme como Vendedor"}
          </button>
        </form>

        <p className="login-footer">
          ¿Ya tenés una cuenta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate("/login")
            }}
          >
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  )
}

export default RegisterProveedorPage
