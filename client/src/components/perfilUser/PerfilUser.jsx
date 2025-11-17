"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/authSlice";
import {
  fetchDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
} from "../../redux/direccionesSlice";
import { compradoresAPI } from "../../services/api";
import { TarjetasSection } from "../tarjetasSection/TarjetasSection";
import "./PerfilUser.css";

const PerfilUser = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const { direcciones, loading: loadingDirecciones } = useSelector(
    (state) => state.direcciones
  );

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [direccionEditando, setDireccionEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formularioDireccion, setFormularioDireccion] = useState({
    calle: "",
    numero: "",
    departamento: "",
    codigoPostal: "",
  });

  const [mostrarFormularioPerfil, setMostrarFormularioPerfil] = useState(false);
  const [formularioPerfil, setFormularioPerfil] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchDirecciones());
    }
  }, [user, dispatch]);

  const handleDireccionChange = (e) => {
    const { name, value } = e.target;
    setFormularioDireccion({
      ...formularioDireccion,
      [name]: value,
    });
  };

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setFormularioPerfil({
      ...formularioPerfil,
      [name]: value,
    });
  };

  const guardarDireccion = async (e) => {
    e.preventDefault();

    if (
      !formularioDireccion.calle ||
      !formularioDireccion.numero
    ) {
      alert("Por favor, completá los campos obligatorios.");
      return;
    }

    const direccionesArray = direcciones.content || direcciones || [];
    if (!direccionEditando && direccionesArray.length >= 2) {
      alert("Solo podés tener un máximo de 2 direcciones.");
      return;
    }

    try {
      setLoading(true);
      if (direccionEditando) {
        await dispatch(
          actualizarDireccion({
            id: direccionEditando.id,
            direccionData: formularioDireccion,
          })
        ).unwrap();
      } else {
        await dispatch(crearDireccion(formularioDireccion)).unwrap();
      }
      cerrarFormulario();
      alert("Dirección guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      alert("Error al guardar la dirección");
    } finally {
      setLoading(false);
    }
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();

    if (!formularioPerfil.nombre || !formularioPerfil.apellido) {
      alert("Por favor, completá los campos obligatorios (Nombre y Apellido).");
      return;
    }

    try {
      setLoading(true);
      await dispatch(
        updateUserProfile({ userId: user.id, userData: formularioPerfil })
      ).unwrap();
      cerrarFormularioPerfil();
      alert("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert(error || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const eliminarDireccionHandler = async (direccionId) => {
    if (!confirm("¿Estás seguro de eliminar esta dirección?")) return;

    try {
      setLoading(true);
      await dispatch(eliminarDireccion(direccionId)).unwrap();
      alert("Dirección eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
      alert("Error al eliminar la dirección");
    } finally {
      setLoading(false);
    }
  };

  const editarDireccion = (direccion) => {
    setDireccionEditando(direccion);
    setFormularioDireccion({
      calle: direccion.calle,
      numero: direccion.numero,
      departamento: direccion.departamento,
      codigoPostal: direccion.codigoPostal || direccion.codigo_postal || "",
    });
    setMostrarFormulario(true);
  };

  const editarPerfil = () => {
    setFormularioPerfil({
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      telefono: user.telefono || "",
    });
    setMostrarFormularioPerfil(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setDireccionEditando(null);
    setFormularioDireccion({
      calle: "",
      numero: "",
      departamento: "",
      codigoPostal: "",
    });
  };

  const cerrarFormularioPerfil = () => {
    setMostrarFormularioPerfil(false);
    setFormularioPerfil({
      nombre: "",
      apellido: "",
      telefono: "",
    });
  };

  if (!user) return <div>Cargando...</div>;

  const direccionesArray = direcciones.content || direcciones || [];

  return (
    <div>
      <div className="perfil-grid">
        <section className="perfil-panel perfil-main">
          <div className="perfil-panel-header">
            <h2>Perfil</h2>
            <a
              href="#"
              className="perfil-editar"
              onClick={(e) => {
                e.preventDefault();
                editarPerfil();
              }}
            >
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
          <TarjetasSection />
        </section>

        <section className="perfil-panel perfil-direccion">
          <div className="perfil-panel-header">
            <h3>Direcciones</h3>
            {direccionesArray.length < 2 && (
              <button
                className="perfil-link perfil-btn-agregar"
                onClick={() => setMostrarFormulario(true)}
                disabled={loading || loadingDirecciones}
              >
                + Agregar dirección
              </button>
            )}
          </div>
          <div className="perfil-panel-body">
            {loadingDirecciones ? (
              <p>Cargando direcciones...</p>
            ) : direccionesArray.length === 0 ? (
              <p className="perfil-sin-direcciones">
                No tenés direcciones guardadas
              </p>
            ) : (
              direccionesArray.map((direccion) => (
                <div key={direccion.id} className="perfil-direccion-item">
                  <div className="perfil-direccion-contenido">
                    <div className="perfil-direccion-texto">
                      <strong>
                        {user.nombre} {user.apellido}
                      </strong>
                      <br />
                      {direccion.calle} {direccion.numero}
                      <br />
                      {direccion.departamento}
                      {(direccion.codigoPostal || direccion.codigo_postal) &&
                        ` (${direccion.codigoPostal || direccion.codigo_postal})`}
                    </div>
                  </div>
                  <div className="perfil-direccion-acciones">
                    <button
                      className="perfil-btn-editar"
                      onClick={() => editarDireccion(direccion)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      className="perfil-btn-eliminar"
                      onClick={() => eliminarDireccionHandler(direccion.id)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {mostrarFormularioPerfil && (
          <div className="perfil-modal-overlay" onClick={cerrarFormularioPerfil}>
            <div
              className="perfil-modal-contenido"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="perfil-modal-header">
                <h3>Editar perfil</h3>
                <button
                  className="perfil-modal-cerrar"
                  onClick={cerrarFormularioPerfil}
                >
                  ×
                </button>
              </div>
              <form onSubmit={guardarPerfil} className="perfil-form-direccion">
                <div className="perfil-form-row">
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre *"
                    value={formularioPerfil.nombre}
                    onChange={handlePerfilChange}
                    required
                  />
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido *"
                    value={formularioPerfil.apellido}
                    onChange={handlePerfilChange}
                    required
                  />
                </div>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={formularioPerfil.telefono}
                  onChange={handlePerfilChange}
                />
                <div className="perfil-readonly-email">
                  <span className="perfil-readonly-label">Email (no modificable)</span>
                  <span className="perfil-readonly-value">{user.email}</span>
                </div>
                <div className="perfil-form-acciones">
                  <button
                    type="button"
                    className="perfil-btn-cancelar"
                    onClick={cerrarFormularioPerfil}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="perfil-btn-guardar"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                  name="departamento"
                  placeholder="Departamento"
                  value={formularioDireccion.departamento}
                  onChange={handleDireccionChange}
                />
                <input
                  type="text"
                  name="codigoPostal"
                  placeholder="Código Postal"
                  value={formularioDireccion.codigoPostal}
                  onChange={handleDireccionChange}
                />
                <div className="perfil-form-acciones">
                  <button
                    type="button"
                    className="perfil-btn-cancelar"
                    onClick={cerrarFormulario}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="perfil-btn-guardar"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilUser;
