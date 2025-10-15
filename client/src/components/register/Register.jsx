"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasenia: "",
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
    if (
      !userData.nombre ||
      !userData.apellido ||
      !userData.email ||
      !userData.telefono ||
      !userData.contrasenia
    ) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    if (userData.contrasenia !== userData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      telefono: userData.telefono,
      contrasenia: userData.contrasenia, // En producción debería estar hasheada
      role: "COMPRADOR", // Role por defecto
    };

    // Leer usuarios guardados
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

    alert("Usuario registrado correctamente.");
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
            placeholder="Nombre"
            value={userData.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={userData.apellido}
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
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={userData.telefono}
            onChange={handleChange}
          />
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

export default Register;
