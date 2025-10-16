"use client"

import { useEffect, useState } from "react"
import { ordenesDeCompraAPI } from "../../services/api"
import "./MisCompras.css"

function MisCompras() {
  const [ordenes, setOrdenes] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

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
      // API returns paginated data with content array
      const ordenesData = response.content || response

      // Fetch details for each order
      const ordenesConDetalles = await Promise.all(
        ordenesData.map(async (orden) => {
          try {
            const ordenCompleta = await ordenesDeCompraAPI.getById(orden.id)
            return ordenCompleta
          } catch (error) {
            console.error(`Error al cargar orden ${orden.id}:`, error)
            return orden
          }
        }),
      )

      setOrdenes(ordenesConDetalles)
    } catch (error) {
      console.error("Error al cargar órdenes:", error)
      alert("Error al cargar tus compras")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mis-compras-container">
        <p>Cargando tus compras...</p>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="mis-compras-container">
        <p>Debes iniciar sesión para ver tus compras.</p>
      </div>
    )
  }

  if (ordenes.length === 0) {
    return (
      <div className="mis-compras-container">
        <h2>Mis Compras</h2>
        <p className="no-compras">Aún no has realizado ninguna compra.</p>
      </div>
    )
  }

  return (
    <div className="mis-compras-container">
      <h2>Mis Compras</h2>
      <div className="ordenes-lista">
        {ordenes.map((orden) => (
          <div key={orden.id} className="orden-card">
            <div className="orden-header">
              <div className="orden-info">
                <h3>Orden #{orden.id}</h3>
                <p className="orden-fecha">Fecha: {orden.fecha}</p>
                <span className={`orden-estado ${orden.estado.toLowerCase()}`}>{orden.estado}</span>
              </div>
              <div className="orden-total">
                <p className="total-label">Total</p>
                <p className="total-monto">${orden.total.toLocaleString()}</p>
              </div>
            </div>

            {orden.detalles && orden.detalles.length > 0 && (
              <div className="orden-detalles">
                <h4>Productos:</h4>
                {orden.detalles.map((detalle) => (
                  <div key={detalle.id} className="detalle-item">
                    <div className="detalle-info">
                      <p className="producto-nombre">{detalle.producto?.nombre || "Producto"}</p>
                      <p className="producto-cantidad">Cantidad: {detalle.cantidad}</p>
                    </div>
                    <div className="detalle-precio">
                      <p className="precio-unitario">${detalle.precio_unitario.toLocaleString()} c/u</p>
                      <p className="subtotal">
                        Subtotal: ${(detalle.cantidad * detalle.precio_unitario).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MisCompras
