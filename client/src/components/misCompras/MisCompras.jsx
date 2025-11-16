"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdenes,
  selectOrdenes,
  selectOrdenesLoading,
  selectOrdenesError,
} from "../../redux/ordenesSlice";
import { selectUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "./MisCompras.css";

function MisCompras() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ordenes = useSelector(selectOrdenes);
  const loading = useSelector(selectOrdenesLoading);
  const error = useSelector(selectOrdenesError);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdenes());
    }
  }, [user, dispatch]);

  const formatearFecha = (fechaString) => {
    const [year, month, day] = fechaString.split("-");
    return `${day}/${month}/${year}`;
  };

  const verDetalle = (ordenId) => {
    navigate(`/compras/${ordenId}`);
  };

  if (error) {
    return (
      <div className="mis-compras-container">
        <h2>Mis Compras</h2>
        <div style={{ textAlign: "center", padding: "2rem", color: "#d946ef" }}>
          <p>Error al cargar tus compras: {error}</p>
          <button
            onClick={() => dispatch(fetchOrdenes())}
            style={{ marginTop: "1rem" }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mis-compras-container">
        <div className="loading-spinner">
          <p>Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mis-compras-container">
        <div className="no-auth">
          <p>Debes iniciar sesión para ver tus compras.</p>
          <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
        </div>
      </div>
    );
  }

  const ordenesData = ordenes?.content || ordenes || [];
  const ordenesFiltradas = [...ordenesData].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  if (ordenesFiltradas.length === 0) {
    return (
      <div className="mis-compras-container">
        <h2>Mis Compras</h2>
        <div className="no-compras">
          <p>Aún no has realizado ninguna compra.</p>
          <button onClick={() => navigate("/experiencias")}>
            Explorar Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-compras-container">
      <h2>Mis Compras</h2>
      <div className="ordenes-lista">
        {ordenesFiltradas.map((orden) => {
          const detalles = orden.detalleOrdenDeCompra || [];
          return (
            <div key={orden.id} className="orden-card">
              <div className="orden-header">
                <div className="orden-info">
                  <h3>Orden #{orden.id}</h3>
                  <p className="orden-fecha">{formatearFecha(orden.fecha)}</p>
                </div>
                <div className="orden-total">
                  <p className="total-label">Total</p>
                  <p className="total-monto">
                    ${orden.total?.toLocaleString() || "0"}
                  </p>
                </div>
              </div>

              <div className="orden-resumen">
                <p className="productos-count">
                  {detalles.length} producto{detalles.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={() => verDetalle(orden.id)}
                  className="btn-ver-detalle"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MisCompras;
