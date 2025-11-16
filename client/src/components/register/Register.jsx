"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerComprador, login } from "../../redux/authSlice";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasenia: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !userData.nombre ||
      !userData.apellido ||
      !userData.email ||
      !userData.telefono ||
      !userData.contrasenia
    ) {
      setError("Por favor, completá todos los campos.");
      return;
    }

    if (userData.contrasenia !== userData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const nuevoUsuario = {
        nombre: userData.nombre,
        apellido: userData.apellido,
        email: userData.email,
        telefono: userData.telefono,
        contrasenia: userData.contrasenia,
        role: "COMPRADOR",
      };

      const result = await dispatch(registerComprador(nuevoUsuario)).unwrap();

      alert("Usuario registrado correctamente.");

      // Hacer login automático
      await dispatch(
        login({
          email: userData.email,
          contrasenia: userData.contrasenia,
        })
      ).unwrap();

      navigate("/");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setError(error || "Error al registrar usuario.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Crear cuenta</h1>

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

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarme"}
          </button>
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
