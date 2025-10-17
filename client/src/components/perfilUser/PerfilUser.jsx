"use client"

import { useState, useEffect } from "react"
import { direccionesAPI, compradoresAPI } from "../../services/api"
import "./PerfilUser.css"

const PerfilUser = () => {
  const [user, setUser] = useState(null)
  const [direcciones, setDirecciones] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [direccionEditando, setDireccionEditando] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formularioDireccion, setFormularioDireccion] = useState({
    calle: "",
    numero: "",
    departamento: "",
    codigoPostal: "",
  })

  const [mostrarFormularioPerfil, setMostrarFormularioPerfil] = useState(false)
  const [formularioPerfil, setFormularioPerfil] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  })

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioLogueado")

    if (usuarioGuardado) {
      const userData = JSON.parse(usuarioGuardado)
      setUser(userData)
      cargarDirecciones()
    }
  }, [])

  const cargarDirecciones = async () => {
    try {
      setLoading(true)
      const response = await direccionesAPI.getAll()
      // API returns paginated data
      setDirecciones(response.content || response)
    } catch (error) {
      console.error("Error al cargar direcciones:", error)
      alert("Error al cargar las direcciones")
    } finally {
      setLoading(false)
    }
  }

  const handleDireccionChange = (e) => {
    const { name, value } = e.target
    setFormularioDireccion({
      ...formularioDireccion,
      [name]: value,
    })
  }

  const handlePerfilChange = (e) => {
    const { name, value } = e.target
    setFormularioPerfil({
      ...formularioPerfil,
      [name]: value,
    })
  }

  const guardarDireccion = async (e) => {
    e.preventDefault()

    if (!formularioDireccion.calle || !formularioDireccion.numero || !formularioDireccion.departamento) {
      alert("Por favor, completá los campos obligatorios.")
      return
    }

    // Verificar límite de 2 direcciones
    if (!direccionEditando && direcciones.length >= 2) {
      alert("Solo podés tener un máximo de 2 direcciones.")
      return
    }

    try {
      setLoading(true)
      if (direccionEditando) {
        // Editar dirección existente
        await direccionesAPI.update(direccionEditando.id, formularioDireccion)
      } else {
        // Crear nueva dirección
        await direccionesAPI.create(formularioDireccion)
      }
      await cargarDirecciones()
      cerrarFormulario()
      alert("Dirección guardada exitosamente")
    } catch (error) {
      console.error("Error al guardar dirección:", error)
      alert("Error al guardar la dirección")
    } finally {
      setLoading(false)
    }
  }

  const guardarPerfil = async (e) => {
    e.preventDefault()

    if (!formularioPerfil.nombre || !formularioPerfil.apellido) {
      alert("Por favor, completá los campos obligatorios (Nombre y Apellido).")
      return
    }

    try {
      setLoading(true)
      // Update user data via API
      const updatedUser = await compradoresAPI.update(user.id, formularioPerfil)

      const usuarioActualizado = {
        ...user,
        nombre: formularioPerfil.nombre,
        apellido: formularioPerfil.apellido,
        telefono: formularioPerfil.telefono,
      }
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioActualizado))

      // Update component state
      setUser(usuarioActualizado)
      cerrarFormularioPerfil()
      alert("Perfil actualizado exitosamente")
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      alert(error.message || "Error al actualizar el perfil")
    } finally {
      setLoading(false)
    }
  }

  const eliminarDireccion = async (direccionId) => {
    if (!confirm("¿Estás seguro de eliminar esta dirección?")) return

    try {
      setLoading(true)
      await direccionesAPI.delete(direccionId)
      await cargarDirecciones()
      alert("Dirección eliminada exitosamente")
    } catch (error) {
      console.error("Error al eliminar dirección:", error)
      alert("Error al eliminar la dirección")
    } finally {
      setLoading(false)
    }
  }

  const editarDireccion = (direccion) => {
    setDireccionEditando(direccion)
    setFormularioDireccion({
      calle: direccion.calle,
      numero: direccion.numero,
      departamento: direccion.departamento,
      codigoPostal: direccion.codigoPostal || direccion.codigo_postal || "",
    })
    setMostrarFormulario(true)
  }

  const editarPerfil = () => {
    setFormularioPerfil({
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      telefono: user.telefono || "",
    })
    setMostrarFormularioPerfil(true)
  }

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setDireccionEditando(null)
    setFormularioDireccion({
      calle: "",
      numero: "",
      departamento: "",
      codigoPostal: "",
    })
  }

  const cerrarFormularioPerfil = () => {
    setMostrarFormularioPerfil(false)
    setFormularioPerfil({
      nombre: "",
      apellido: "",
      telefono: "",
    })
  }

  if (!user) return <div>Cargando...</div>

  return (
    <div className="perfil-grid">
      <section className="perfil-panel perfil-main">
        <div className="perfil-panel-header">
          <h2>Perfil</h2>
          <a
            href="#"
            className="perfil-editar"
            onClick={(e) => {
              e.preventDefault()
              editarPerfil()
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
              disabled={loading}
            >
              + Agregar dirección
            </button>
          )}
        </div>
        <div className="perfil-panel-body">
          {loading ? (
            <p>Cargando direcciones...</p>
          ) : direcciones.length === 0 ? (
            <p className="perfil-sin-direcciones">No tenés direcciones guardadas</p>
          ) : (
            direcciones.map((direccion) => (
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
                  <button className="perfil-btn-editar" onClick={() => editarDireccion(direccion)} disabled={loading}>
                    Editar
                  </button>
                  <button
                    className="perfil-btn-eliminar"
                    onClick={() => eliminarDireccion(direccion.id)}
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
          <div className="perfil-modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="perfil-modal-header">
              <h3>Editar perfil</h3>
              <button className="perfil-modal-cerrar" onClick={cerrarFormularioPerfil}>
                ×
              </button>
            </div>
            <form onSubmit={guardarPerfil} className="perfil-form-direccion">
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
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={formularioPerfil.telefono}
                onChange={handlePerfilChange}
              />
              <div style={{ padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "4px", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: "4px" }}>
                  Email (no modificable)
                </span>
                <span style={{ fontSize: "14px", color: "#333" }}>{user.email}</span>
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
                <button type="submit" className="perfil-btn-guardar" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarFormulario && (
        <div className="perfil-modal-overlay" onClick={cerrarFormulario}>
          <div className="perfil-modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="perfil-modal-header">
              <h3>{direccionEditando ? "Editar dirección" : "Nueva dirección"}</h3>
              <button className="perfil-modal-cerrar" onClick={cerrarFormulario}>
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
                placeholder="Departamento *"
                value={formularioDireccion.departamento}
                onChange={handleDireccionChange}
                required
              />
              <input
                type="text"
                name="codigoPostal"
                placeholder="Código Postal"
                value={formularioDireccion.codigoPostal}
                onChange={handleDireccionChange}
              />
              <div className="perfil-form-acciones">
                <button type="button" className="perfil-btn-cancelar" onClick={cerrarFormulario} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="perfil-btn-guardar" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PerfilUser
