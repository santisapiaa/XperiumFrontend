"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ordenesDeCompraAPI } from "../../services/api"
import "./DetalleOrden.css"

function DetalleOrden() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [orden, setOrden] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioLogueado")
    if (!usuarioGuardado) {
      navigate("/login")
      return
    }
    cargarOrden()
  }, [id])

  const cargarOrden = async () => {
    try {
      setLoading(true)
      setError(null)
      const ordenCompleta = await ordenesDeCompraAPI.getById(id)
      setOrden(ordenCompleta)
    } catch (error) {
      console.error("Error loading order:", error)
      setError("No se pudo cargar el detalle de la orden. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fechaString) => {
    const [year, month, day] = fechaString.split("-")
    return `${day}/${month}/${year}`
  }

  const calcularSubtotal = (detalle) => {
    const cantidad = detalle.cantidad || 0
    const precioUnitario = detalle.precio_unitario || detalle.precioUnitario || 0
    return cantidad * precioUnitario
  }

  if (loading) {
    return (
      <div className="detalle-orden-container">
        <div className="loading-spinner">
          <p>Cargando detalle de la orden...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="detalle-orden-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate("/compras")} className="btn-volver">
            Volver a Mis Compras
          </button>
        </div>
      </div>
    )
  }

  if (!orden) {
    return (
      <div className="detalle-orden-container">
        <div className="error-message">
          <p>No se encontró la orden solicitada.</p>
          <button onClick={() => navigate("/compras")} className="btn-volver">
            Volver a Mis Compras
          </button>
        </div>
      </div>
    )
  }

  const detalles = orden.detalleOrdenDeCompra || []

  return (
    <div className="detalle-orden-container">
      <div className="detalle-orden-header">
        <button onClick={() => navigate("/compras")} className="btn-volver">
          ← Volver a Mis Compras
        </button>
        <h1>Detalle de Orden #{orden.id}</h1>
      </div>

      <div className="orden-info-card">
        <div className="orden-info-row">
          <div className="info-item">
            <span className="info-label">Fecha de compra:</span>
            <span className="info-value">{formatearFecha(orden.fecha)}</span>
          </div>
        </div>
      </div>

      <div className="productos-section">
        <h2>Productos</h2>
        {detalles.length > 0 ? (
          <div className="productos-lista">
            {detalles.map((detalle, index) => (
              <div key={detalle.id || index} className="producto-card">
                <div className="producto-left-container">
                  {detalle.producto?.imagenUrl && (
                    <div className="producto-imagen">
                      <img
                        src={detalle.producto.imagenUrl || "/placeholder.svg"}
                        alt={detalle.producto.nombre || "Producto"}
                      />
                    </div>
                  )}
                  <div className="producto-info">
                    <h3>
                      {detalle.producto?.nombre || detalle.productoNombre || "Producto"}
                    </h3>
                    <span className="detalle-cantidad">Cantidad: {detalle.cantidad}</span>
                    <span className="detalle-precio">
                      Precio unitario: ${(detalle.precio_unitario || detalle.precioUnitario || 0).toLocaleString()}
                    </span>
                  </div>
                 
                </div>
                <div className="producto-precio-container">
                  
                  <div className="subtotal-section">
                    <span className="subtotal-label">Subtotal</span>
                    <span className="subtotal-valor">${calcularSubtotal(detalle).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-productos">
            <p>No hay productos en esta orden.</p>
          </div>
        )}
      </div>

      <div className="orden-resumen">
        <div className="resumen-card">
          <h3>Resumen de la orden</h3>
          <div className="resumen-linea">
            <span>Cantidad de productos:</span>
            <span>{detalles.length}</span>
          </div>
          <div className="resumen-linea">
            <span>Total de items:</span>
            <span>{detalles.reduce((total, detalle) => total + (detalle.cantidad || 0), 0)}</span>
          </div>
          <div className="resumen-linea total">
            <span>Total:</span>
            <span className="total-monto">${(orden.total || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleOrden
