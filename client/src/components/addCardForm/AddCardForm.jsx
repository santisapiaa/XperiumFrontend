import { useState } from "react";
import { useDispatch } from "react-redux";
import { crearTarjeta } from "../../redux/tarjetasSlice";
import "./AddCardForm.css";

function AddCardForm({ onCardAdded }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaVencimiento: "", // renamed from vencimiento to fechaVencimiento to match backend
    cvv: "",
    tipoTarjeta: "CREDITO",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatear número de tarjeta (solo dígitos, máximo 16)
    if (name === "numeroTarjeta") {
      const digits = value.replace(/\D/g, "").slice(0, 16);
      setFormData(prev => ({
        ...prev,
        [name]: digits,
      }));
    }
    // Formatear CVV (solo dígitos, máximo 4)
    else if (name === "cvv") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      setFormData(prev => ({
        ...prev,
        [name]: digits,
      }));
    }
    else if (name === "fechaVencimiento") {
      let formatted = value.replace(/\D/g, "").slice(0, 4);
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
      }
      setFormData(prev => ({
        ...prev,
        [name]: formatted,
      }));
    }
    // Nombre del titular (solo letras y espacios)
    else if (name === "nombreTitular") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    // Tipo de tarjeta
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.numeroTarjeta || formData.numeroTarjeta.length !== 16) {
      setError("El número de tarjeta debe tener 16 dígitos");
      return false;
    }
    if (!formData.nombreTitular.trim()) {
      setError("El nombre del titular es requerido");
      return false;
    }
    if (!formData.fechaVencimiento || formData.fechaVencimiento.length !== 5) {
      setError("El vencimiento debe ser en formato MM/YY");
      return false;
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      setError("El CVV debe tener al menos 3 dígitos");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(crearTarjeta(formData)).unwrap();
      setFormData({
        numeroTarjeta: "",
        nombreTitular: "",
        fechaVencimiento: "",
        cvv: "",
        tipoTarjeta: "CREDITO",
      });
      onCardAdded?.();
    } catch (err) {
      console.log("[v0] Error creating card:", err);
      setError(err.message || "Error al agregar la tarjeta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-card-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="numeroTarjeta">Número de tarjeta</label>
        <input
          id="numeroTarjeta"
          type="text"
          name="numeroTarjeta"
          placeholder="0000 0000 0000 0000"
          value={formData.numeroTarjeta}
          onChange={handleChange}
          maxLength="16"
          required
        />
        <small>{formData.numeroTarjeta.length}/16 dígitos</small>
      </div>

      <div className="form-group">
        <label htmlFor="nombreTitular">Nombre del titular</label>
        <input
          id="nombreTitular"
          type="text"
          name="nombreTitular"
          placeholder="JUAN PEREZ"
          value={formData.nombreTitular}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fechaVencimiento">Vencimiento</label>
          <input
            id="fechaVencimiento"
            type="text"
            name="fechaVencimiento"
            placeholder="MM/YY"
            value={formData.fechaVencimiento}
            onChange={handleChange}
            maxLength="5"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            id="cvv"
            type="text"
            name="cvv"
            placeholder="000"
            value={formData.cvv}
            onChange={handleChange}
            maxLength="4"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tipoTarjeta">Tipo de tarjeta</label>
        <select
          id="tipoTarjeta"
          name="tipoTarjeta"
          value={formData.tipoTarjeta}
          onChange={handleChange}
        >
          <option value="CREDITO">Tarjeta de crédito</option>
          <option value="DEBITO">Tarjeta de débito</option>
        </select>
      </div>

      <button type="submit" disabled={loading} className="btn-submit">
        {loading ? "Agregando..." : "Agregar tarjeta"}
      </button>
    </form>
  );
}

export default AddCardForm;
