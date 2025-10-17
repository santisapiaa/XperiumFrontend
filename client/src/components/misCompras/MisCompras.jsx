"use client"

import { useEffect, useState } from "react"
import { ordenesDeCompraAPI } from "../../services/api"
import { useNavigate } from "react-router-dom"
import "./MisCompras.css"

function MisCompras() {
  const [ordenes, setOrdenes] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioLogueado")
    if (usuarioGuardado) {
      const datosUsuario = JSON.parse(usuarioGuardado)
      setUsuario(datosUsuario)
      cargarOrdenes()
    } else {
      setLoading(false)
    }
  }, [])

  const cargarOrdenes = async () => {
    try {
      setLoading(true)
      const response = await ordenesDeCompraAPI.getAll()

      const ordenesData = response.content || response

      const ordenesFiltradas = ordenesData
        .filter((orden) => orden.estado === "FINALIZADA")
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

      setOrdenes(ordenesFiltradas)
    } catch (error) {
      console.error("Error loading orders:", error)
      alert("Error al cargar tus compras. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const verDetalle = (ordenId) => {
    navigate(`/compras/${ordenId}`)
  }

  if (loading) {
    return (
      <div className="mis-compras-container">
        <div className="loading-spinner">
          <p>Cargando tus compras...</p>
        </div>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="mis-compras-container">
        <div className="no-auth">
          <p>Debes iniciar sesión para ver tus compras.</p>
          <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
        </div>
      </div>
    )
  }

  if (ordenes.length === 0) {
    return (
      <div className="mis-compras-container">
        <h2>Mis Compras</h2>
        <div className="no-compras">
          <p>Aún no has realizado ninguna compra.</p>
          <button onClick={() => navigate("/experiencias")}>Explorar Productos</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mis-compras-container">
      <h2>Mis Compras</h2>
      <div className="ordenes-lista">
        {ordenes.map((orden) => {
          const detalles = orden.detalleOrdenDeCompra || []
          return (
            <div key={orden.id} className="orden-card">
              <div className="orden-header">
                <div className="orden-info">
                  <h3>Orden #{orden.id}</h3>
                  <p className="orden-fecha">{formatearFecha(orden.fecha)}</p>
                  <span className={`orden-estado ${orden.estado.toLowerCase()}`}>{orden.estado}</span>
                </div>
                <div className="orden-total">
                  <p className="total-label">Total</p>
                  <p className="total-monto">${orden.total?.toLocaleString() || "0"}</p>
                </div>
              </div>

              <div className="orden-resumen">
                <p className="productos-count">
                  {detalles.length} producto{detalles.length !== 1 ? "s" : ""}
                </p>
                <button onClick={() => verDetalle(orden.id)} className="btn-ver-detalle">
                  Ver detalle
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MisCompras
