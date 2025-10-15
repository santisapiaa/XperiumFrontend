import React, { useState } from "react";
import "./loginpage.css";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  // Estado del formulario
  const [userData, setUserData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Actualizar los campos
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Guardar usuario
  const handleRegister = (e) => {
    e.preventDefault();

    // Validaciones
    if (!userData.nombre || !userData.email || !userData.password) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Estructura del usuario (simulando tu JSON original)
    const nuevoUsuario = {
      id: Date.now(),
      apellido: "",
      contrasenia: userData.password,
      email: userData.email,
      nombre: userData.nombre,
      role: "comprador",
      telefono: "",
    };

    // Leer usuarios guardados (si no hay, crea un array vacío)
    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuariosJSON")) || [];

    // Verificar si el correo ya existe
    const existe = usuariosGuardados.find(
      (u) => u.email === nuevoUsuario.email
    );

    if (existe) {
      alert("Ese correo ya está registrado.");
      return;
    }

    // Guardar nuevo usuario
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuariosJSON", JSON.stringify(usuariosGuardados));

    alert("✅ Usuario registrado correctamente.");
    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Crear cuenta</h1>

        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={userData.nombre}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={userData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={userData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={userData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit">Registrarme</button>
        </form>

        <p className="login-footer">
          ¿Ya tenés una cuenta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;



