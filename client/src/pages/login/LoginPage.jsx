import React, { useState } from "react";
import "./loginpage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  // Estado para guardar lo que escribe el usuario en el formulario
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Cada vez que el usuario escribe, se actualiza el estado
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Cuando hace clic en “Ingresar”
  const handleLogin = (e) => {
    e.preventDefault(); // evita que la página se recargue

    // 🔹 Obtenemos los usuarios guardados en localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuariosJSON")) || [];

    // 🔹 Buscamos si el email y contraseña coinciden con algún usuario guardado
    const usuarioValido = usuarios.find(
      (u) => u.email === loginData.email && u.contrasenia === loginData.password
    );

    // 🔹 Si encontramos coincidencia:
    if (usuarioValido) {
      // Guardamos el usuario logueado actual
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioValido));

      // Mostramos un saludo
      alert(`🎉 Bienvenido, ${usuarioValido.nombre}!`);

      // Redirigimos a la página principal
      navigate("/");
    } else {
      // Si los datos no coinciden, mostramos error
      alert("❌ Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>

        {/* Formulario de login */}
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
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
          <button type="submit">Ingresar</button>
        </form>

        {/* Enlace para registrarse */}
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
