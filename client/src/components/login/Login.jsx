"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  selectAuthLoading,
  selectAuthError,
} from "../../redux/authSlice";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [loginData, setLoginData] = useState({
    email: "",
    contrasenia: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(
        login({
          email: loginData.email,
          contrasenia: loginData.contrasenia,
        })
      ).unwrap();

      const userName = result.userData?.nombre || result.nombre || "Usuario";
      const userRole = result.rol;

      alert(`Bienvenido ${userName}! Has iniciado sesión correctamente.`);

      console.log("Login result:", result);
      console.log("User role:", userRole);

      if (userRole === "PROVEEDOR") {
        navigate("/proveedor");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.includes("CORS") || err.includes("conectar al servidor")) {
        alert(
          "Error de conexión con el servidor. Asegúrate de haber configurado CORS globalmente en el backend (WebConfig)."
        );
      } else {
        alert("Usuario o contraseña incorrectos.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contrasenia"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="login-footer">
          ¿No tenés cuenta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Registrate
          </a>
        </p>

        <p className="login-footer" style={{ marginTop: "8px" }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register-proveedor");
            }}
            style={{ color: "#d946ef" }}
          >
            Soy Vendedor
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
