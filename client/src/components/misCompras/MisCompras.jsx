"use client";

import { useEffect, useState } from "react";
import productsData from "../../assets/products.json";
import "./MisCompras.css";

function MisCompras() {
  const [ordenes, setOrdenes] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Obtener usuario logueado
    const usuarioGuardado = localStorage.getItem("usuarioLogueado");
    if (usuarioGuardado) {
      const datosUsuario = JSON.parse(usuarioGuardado);
      setUsuario(datosUsuario);

      // Obtener órdenes de compra del usuario
      const ordenesGuardadas = localStorage.getItem("ordenDeCompra");
      const detallesGuardados = localStorage.getItem("detalleDeCompra");

      if (ordenesGuardadas && detallesGuardados) {
        const todasLasOrdenes = JSON.parse(ordenesGuardadas);
        const todosLosDetalles = JSON.parse(detallesGuardados);

        // Filtrar órdenes del usuario logueado
        const ordenesDelUsuario = todasLasOrdenes.filter(
          (orden) => orden.comprador_id === datosUsuario.id
        );

        // Agregar detalles a cada orden
        const ordenesConDetalles = ordenesDelUsuario.map((orden) => {
          const detallesOrden = todosLosDetalles.filter(
            (detalle) => detalle.orden_de_compra_id === orden.id
          );

          // Agregar información del producto a cada detalle
          const detallesConProducto = detallesOrden.map((detalle) => {
            const producto = productsData.find(
              (p) => p.id === detalle.producto_id
            );
            return {
              ...detalle,
              producto: producto || { nombre: "Producto no encontrado" },
            };
          });

          return {
            ...orden,
            detalles: detallesConProducto,
          };
        });

        setOrdenes(ordenesConDetalles);
      }
    }
  }, []);

  if (!usuario) {
    return (
      <div className="mis-compras-container">
        <p>Debes iniciar sesión para ver tus compras.</p>
      </div>
    );
  }

  if (ordenes.length === 0) {
    return (
      <div className="mis-compras-container">
        <h2>Mis Compras</h2>
        <p className="no-compras">Aún no has realizado ninguna compra.</p>
      </div>
    );
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
                <span className={`orden-estado ${orden.estado.toLowerCase()}`}>
                  {orden.estado}
                </span>
              </div>
              <div className="orden-total">
                <p className="total-label">Total</p>
                <p className="total-monto">${orden.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="orden-detalles">
              <h4>Productos:</h4>
              {orden.detalles.map((detalle) => (
                <div key={detalle.id} className="detalle-item">
                  <div className="detalle-info">
                    <p className="producto-nombre">{detalle.producto.nombre}</p>
                    <p className="producto-cantidad">
                      Cantidad: {detalle.cantidad}
                    </p>
                  </div>
                  <div className="detalle-precio">
                    <p className="precio-unitario">
                      ${detalle.precio_unitario.toLocaleString()} c/u
                    </p>
                    <p className="subtotal">
                      Subtotal: $
                      {(
                        detalle.cantidad * detalle.precio_unitario
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MisCompras;
