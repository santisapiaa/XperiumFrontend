"use client";

import { useState, useEffect } from "react";
import "./PerfilUser.css";

const PerfilUser = () => {
  const [user, setUser] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [direccionEditando, setDireccionEditando] = useState(null);
  const [formularioDireccion, setFormularioDireccion] = useState({
    calle: "",
    numero: "",
    ciudad: "",
    provincia: "",
    codigo_postal: "",
    es_principal: false,
  });

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioLogueado");
    if (usuarioGuardado) {
      const userData = JSON.parse(usuarioGuardado);
      setUser(userData);
      cargarDirecciones(userData.id);
    }
  }, []);

  const cargarDirecciones = (userId) => {
    const todasDirecciones =
      JSON.parse(localStorage.getItem("direccionesUsuarios")) || [];
    const direccionesUsuario = todasDirecciones.filter(
      (dir) => dir.usuario_id === userId
    );
    setDirecciones(direccionesUsuario);
  };

  const handleDireccionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormularioDireccion({
      ...formularioDireccion,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const guardarDireccion = (e) => {
    e.preventDefault();

    if (
      !formularioDireccion.calle ||
      !formularioDireccion.numero ||
      !formularioDireccion.ciudad
    ) {
      alert("Por favor, completá los campos obligatorios.");
      return;
    }

    // Verificar límite de 2 direcciones
    if (!direccionEditando && direcciones.length >= 2) {
      alert("Solo podés tener un máximo de 2 direcciones.");
      return;
    }

    const todasDirecciones =
      JSON.parse(localStorage.getItem("direccionesUsuarios")) || [];

    if (direccionEditando) {
      // Editar dirección existente
      const index = todasDirecciones.findIndex(
        (dir) => dir.id === direccionEditando.id
      );
      todasDirecciones[index] = {
        ...direccionEditando,
        ...formularioDireccion,
      };
    } else {
      // Crear nueva dirección
      const nuevaDireccion = {
        id: Date.now(),
        usuario_id: user.id,
        ...formularioDireccion,
      };
      todasDirecciones.push(nuevaDireccion);
    }

    localStorage.setItem(
      "direccionesUsuarios",
      JSON.stringify(todasDirecciones)
    );
    cargarDirecciones(user.id);
    cerrarFormulario();
  };

  const eliminarDireccion = (direccionId) => {
    if (!confirm("¿Estás seguro de eliminar esta dirección?")) return;

    const todasDirecciones =
      JSON.parse(localStorage.getItem("direccionesUsuarios")) || [];
    const direccionesFiltradas = todasDirecciones.filter(
      (dir) => dir.id !== direccionId
    );

    localStorage.setItem(
      "direccionesUsuarios",
      JSON.stringify(direccionesFiltradas)
    );
    cargarDirecciones(user.id);
  };

  const editarDireccion = (direccion) => {
    setDireccionEditando(direccion);
    setFormularioDireccion({
      calle: direccion.calle,
      numero: direccion.numero,
      ciudad: direccion.ciudad,
      provincia: direccion.provincia,
      codigo_postal: direccion.codigo_postal,
      es_principal: direccion.es_principal,
    });
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setDireccionEditando(null);
    setFormularioDireccion({
      calle: "",
      numero: "",
      ciudad: "",
      provincia: "",
      codigo_postal: "",
      es_principal: false,
    });
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="perfil-grid">
      <section className="perfil-panel perfil-main">
        <div className="perfil-panel-header">
          <h2>Perfil</h2>
          <a href="#" className="perfil-editar">
            Editar
          </a>
        </div>
        <div className="perfil-datos">
          <div>
            <span className="perfil-label">Nombre</span>
            <div>{user.nombre || "—"}</div>
          </div>
          <div>
            <span className="perfil-label">Apellido</span>
            <div>{user.apellido || "—"}</div>
          </div>
          <div>
            <span className="perfil-label">Teléfono</span>
            <div>{user.telefono || "—"}</div>
          </div>
          <div>
            <span className="perfil-label">Email</span>
            <div>{user.email || "—"}</div>
          </div>
        </div>
      </section>

      <section className="perfil-panel perfil-pago">
        <div className="perfil-panel-header">
          <h3>Métodos de Pago</h3>
        </div>
        <div className="perfil-panel-body">
          <a href="#" className="perfil-link">
            +Nueva Tarjeta
          </a>
        </div>
      </section>

      <section className="perfil-panel perfil-direccion">
        <div className="perfil-panel-header">
          <h3>Direcciones</h3>
          {direcciones.length < 2 && (
            <button
              className="perfil-link perfil-btn-agregar"
              onClick={() => setMostrarFormulario(true)}
            >
              + Agregar dirección
            </button>
          )}
        </div>
        <div className="perfil-panel-body">
          {direcciones.length === 0 ? (
            <p className="perfil-sin-direcciones">
              No tenés direcciones guardadas
            </p>
          ) : (
            direcciones.map((direccion) => (
              <div key={direccion.id} className="perfil-direccion-item">
                <div className="perfil-direccion-contenido">
                  {direccion.es_principal && (
                    <span className="perfil-direccion-badge">Principal</span>
                  )}
                  <div className="perfil-direccion-texto">
                    <strong>
                      {user.nombre} {user.apellido}
                    </strong>
                    <br />
                    {direccion.calle} {direccion.numero}
                    <br />
                    {direccion.ciudad}
                    {direccion.provincia && `, ${direccion.provincia}`}
                    {direccion.codigo_postal && ` (${direccion.codigo_postal})`}
                  </div>
                </div>
                <div className="perfil-direccion-acciones">
                  <button
                    className="perfil-btn-editar"
                    onClick={() => editarDireccion(direccion)}
                  >
                    Editar
                  </button>
                  <button
                    className="perfil-btn-eliminar"
                    onClick={() => eliminarDireccion(direccion.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {mostrarFormulario && (
        <div className="perfil-modal-overlay" onClick={cerrarFormulario}>
          <div
            className="perfil-modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="perfil-modal-header">
              <h3>
                {direccionEditando ? "Editar dirección" : "Nueva dirección"}
              </h3>
              <button
                className="perfil-modal-cerrar"
                onClick={cerrarFormulario}
              >
                ×
              </button>
            </div>
            <form onSubmit={guardarDireccion} className="perfil-form-direccion">
              <div className="perfil-form-row">
                <input
                  type="text"
                  name="calle"
                  placeholder="Calle *"
                  value={formularioDireccion.calle}
                  onChange={handleDireccionChange}
                  required
                />
                <input
                  type="text"
                  name="numero"
                  placeholder="Número *"
                  value={formularioDireccion.numero}
                  onChange={handleDireccionChange}
                  required
                />
              </div>
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad *"
                value={formularioDireccion.ciudad}
                onChange={handleDireccionChange}
                required
              />
              <input
                type="text"
                name="provincia"
                placeholder="Provincia"
                value={formularioDireccion.provincia}
                onChange={handleDireccionChange}
              />
              <input
                type="text"
                name="codigo_postal"
                placeholder="Código Postal"
                value={formularioDireccion.codigo_postal}
                onChange={handleDireccionChange}
              />
              <label className="perfil-checkbox-label">
                <input
                  type="checkbox"
                  name="es_principal"
                  checked={formularioDireccion.es_principal}
                  onChange={handleDireccionChange}
                />
                Marcar como dirección principal
              </label>
              <div className="perfil-form-acciones">
                <button
                  type="button"
                  className="perfil-btn-cancelar"
                  onClick={cerrarFormulario}
                >
                  Cancelar
                </button>
                <button type="submit" className="perfil-btn-guardar">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilUser;
