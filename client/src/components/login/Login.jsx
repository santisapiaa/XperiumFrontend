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

      alert(`Bienvenido ${userName}!`);

      if (userRole === "PROVEEDOR") {
        navigate("/proveedor");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Usuario o contraseña incorrectos.");
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
            value={loginData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contrasenia"
            placeholder="Contraseña"
            value={loginData.contrasenia}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="login-footer">
          <p>
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
          <p style={{ marginTop: "12px" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register-proveedor");
              }}
            >
              Soy Vendedor
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
