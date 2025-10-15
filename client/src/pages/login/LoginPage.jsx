import React, { useState } from "react";
import "./loginpage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Obtener usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuariosJSON")) || [];

    // Buscar coincidencia
    const usuarioValido = usuarios.find(
      (u) =>
        u.email === loginData.email && u.contrasenia === loginData.password
    );

    if (usuarioValido) {
      // Guardar quién está logueado
      localStorage.setItem(
        "usuarioLogueado",
        JSON.stringify(usuarioValido)
      );

      alert(`🎉 Bienvenido, ${usuarioValido.nombre}!`);
      navigate("/");
    } else {
      alert("❌ Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={loginData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={loginData.password}
            onChange={handleChange}
          />
          <button type="submit">Ingresar</button>
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
      </div>
    </div>
  );
}

export default LoginPage;



