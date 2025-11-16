import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTarjetas,
  crearTarjeta,
  actualizarTarjeta,
  eliminarTarjeta,
} from "../../redux/tarjetasSlice";
import "./TarjetasSection.css";

export const TarjetasSection = () => {
  const dispatch = useDispatch();
  const { tarjetas, loading, error } = useSelector((state) => state.tarjetas);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaVencimiento: "",
    cvv: "",
    tipoTarjeta: "CREDITO",
    tarjetaPrincipal: false,
  });

  useEffect(() => {
    dispatch(fetchTarjetas());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.numeroTarjeta || formData.numeroTarjeta.length < 13) {
      alert("Número de tarjeta inválido (mínimo 13 dígitos)");
      return;
    }

    try {
      if (editandoId) {
        await dispatch(
          actualizarTarjeta({ id: editandoId, tarjetaData: formData })
        ).unwrap();
      } else {
        await dispatch(crearTarjeta(formData)).unwrap();
      }
      resetearFormulario();
      setMostrarFormulario(false);
    } catch (err) {
      console.error("Error al guardar tarjeta:", err);
    }
  };

  const handleEditar = (tarjeta) => {
    setFormData(tarjeta);
    setEditandoId(tarjeta.id);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarjeta?")) {
      try {
        await dispatch(eliminarTarjeta(id)).unwrap();
      } catch (err) {
        console.error("Error al eliminar tarjeta:", err);
      }
    }
  };

  const resetearFormulario = () => {
    setFormData({
      numeroTarjeta: "",
      nombreTitular: "",
      fechaVencimiento: "",
      cvv: "",
      tipoTarjeta: "CREDITO",
      tarjetaPrincipal: false,
    });
    setEditandoId(null);
  };

  const cancelarEdicion = () => {
    resetearFormulario();
    setMostrarFormulario(false);
  };

  const ocultarNumero = (numero) => {
    return `**** **** **** ${numero.slice(-4)}`;
  };

  return (
    <div className="tarjetas-section">
      <div className="tarjetas-header">
        <h2>Mis Tarjetas</h2>
        {!mostrarFormulario && (
          <button
            className="btn-agregar-tarjeta"
            onClick={() => setMostrarFormulario(true)}
          >
            + Agregar Tarjeta
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {mostrarFormulario && (
        <div className="formulario-tarjeta">
          <h3>{editandoId ? "Editar Tarjeta" : "Nueva Tarjeta"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="numeroTarjeta">Número de Tarjeta</label>
              <input
                type="text"
                id="numeroTarjeta"
                name="numeroTarjeta"
                value={formData.numeroTarjeta}
                onChange={handleInputChange}
                placeholder="1234567890123"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nombreTitular">Nombre del Titular</label>
              <input
                type="text"
                id="nombreTitular"
                name="nombreTitular"
                value={formData.nombreTitular}
                onChange={handleInputChange}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaVencimiento">Fecha Vencimiento</label>
                <input
                  type="text"
                  id="fechaVencimiento"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipoTarjeta">Tipo de Tarjeta</label>
                <select
                  id="tipoTarjeta"
                  name="tipoTarjeta"
                  value={formData.tipoTarjeta}
                  onChange={handleInputChange}
                >
                  <option value="CREDITO">Crédito</option>
                  <option value="DEBITO">Débito</option>
                </select>
              </div>

              <div className="form-group checkbox">
                <label htmlFor="tarjetaPrincipal">
                  <input
                    type="checkbox"
                    id="tarjetaPrincipal"
                    name="tarjetaPrincipal"
                    checked={formData.tarjetaPrincipal}
                    onChange={handleInputChange}
                  />
                  Tarjeta Principal
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-guardar">
                {editandoId ? "Actualizar" : "Agregar"} Tarjeta
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="loading">Cargando tarjetas...</p>}

      <div className="lista-tarjetas">
        {Array.isArray(tarjetas) && tarjetas.length > 0 ? (
          tarjetas.map((tarjeta) => (
            <div key={tarjeta.id} className="tarjeta-card">
              {tarjeta.tarjetaPrincipal && (
                <div className="badge-principal">Principal</div>
              )}
              <div className="tarjeta-info">
                <div className="numero-tarjeta">
                  {ocultarNumero(tarjeta.numeroTarjeta)}
                </div>
                <div className="titular">{tarjeta.nombreTitular}</div>
                <div className="details">
                  <span className="vencimiento">
                    Vence: {tarjeta.fechaVencimiento}
                  </span>
                  <span className="tipo-badge">{tarjeta.tipoTarjeta}</span>
                </div>
              </div>
              <div className="tarjeta-acciones">
                <button
                  className="btn-editar"
                  onClick={() => handleEditar(tarjeta)}
                >
                  Editar
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => handleEliminar(tarjeta.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="sin-tarjetas">No tienes tarjetas registradas</p>
        )}
      </div>
    </div>
  );
};
