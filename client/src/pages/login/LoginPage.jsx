"use client"

import { useState } from "react"
import "./loginpage.css"
import { useNavigate } from "react-router-dom"
import { authAPI, compradoresAPI } from "../../services/api"

function LoginPage() {
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState({
    email: "",
    contrasenia: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Attempting login with:", loginData.email)
      const loginResponse = await authAPI.login(loginData.email, loginData.contrasenia)
      console.log("[v0] Login response:", loginResponse)

      localStorage.setItem("token", loginResponse.access_token)

      try {
        const userData = await compradoresAPI.getMiCuenta(loginResponse.access_token)
        console.log("[v0] User data from /compradores/micuenta:", userData)

        const userToSave = {
          ...userData,
          access_token: loginResponse.access_token,
        }

        localStorage.setItem("usuarioLogueado", JSON.stringify(userToSave))
        alert(`🎉 Bienvenido ${userData.nombre || "Usuario"}! Has iniciado sesión correctamente.`)
      } catch (userDataError) {
        console.log("[v0] Could not fetch from /compradores/micuenta, user might be a provider:", userDataError)

        const minimalUserData = {
          email: loginData.email,
          access_token: loginResponse.access_token,
        }
        localStorage.setItem("usuarioLogueado", JSON.stringify(minimalUserData))
        alert(`🎉 Bienvenido! Has iniciado sesión correctamente.`)
      }

      navigate("/")
    } catch (error) {
      console.error("[v0] Login error:", error)

      if (error.message.includes("CORS") || error.message.includes("conectar al servidor")) {
        alert(
          "❌ Error de conexión con el servidor. Asegúrate de haber configurado CORS globalmente en el backend (WebConfig).",
        )
      } else {
        alert("❌ Usuario o contraseña incorrectos.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required />
          <input type="password" name="contrasenia" placeholder="Contraseña" onChange={handleChange} required />
          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="login-footer">
          ¿No tenés cuenta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate("/register")
            }}
          >
            Registrate
          </a>
        </p>

        <p className="login-footer" style={{ marginTop: "8px" }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate("/register-proveedor")
            }}
            style={{ color: "#d946ef" }}
          >
            Soy Vendedor
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
