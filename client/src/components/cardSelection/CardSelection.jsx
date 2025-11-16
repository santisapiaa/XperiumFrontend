import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTarjetas, fetchTarjetas } from "../../redux/tarjetasSlice";
import AddCardForm from "../addCardForm/AddCardForm";
import "./CardSelection.css";

function CardSelection({ onSelect, selected, onAddNew }) {
  const dispatch = useDispatch();
  const tarjetas = useSelector(selectTarjetas);
  const [showAddCard, setShowAddCard] = useState(false);
  const [loadedCards, setLoadedCards] = useState(false);

  useEffect(() => {
    if (!loadedCards && Array.isArray(tarjetas) && tarjetas.length === 0) {
      dispatch(fetchTarjetas());
      setLoadedCards(true);
    }
  }, [dispatch, tarjetas, loadedCards]);

  const handleCardSelect = (tarjeta) => {
    onSelect({
      type: "card",
      details: {
        id: tarjeta.id,
        numero: tarjeta.numeroTarjeta,
        titular: tarjeta.nombreTitular,
        tipo: tarjeta.tipoTarjeta,
      },
    });
  };

  const handleAddCardClick = () => {
    setShowAddCard(true);
    onAddNew?.();
  };

  const handleCardAdded = () => {
    setShowAddCard(false);
    dispatch(fetchTarjetas());
  };

  if (showAddCard) {
    return (
      <div className="card-selection-form">
        <div className="form-header">
          <button 
            className="btn-back"
            onClick={() => setShowAddCard(false)}
          >
            ← Volver
          </button>
          <h3>Agregar nueva tarjeta</h3>
        </div>
        <AddCardForm onCardAdded={handleCardAdded} />
      </div>
    );
  }

  return (
    <div className="card-selection">
      {Array.isArray(tarjetas) && tarjetas.length > 0 ? (
        <>
          <div className="cards-list">
            {tarjetas.map((tarjeta) => (
              <label key={tarjeta.id} className="card-option">
                <input
                  type="radio"
                  name="card"
                  value={tarjeta.id}
                  checked={selected?.details?.id === tarjeta.id && selected?.type === "card"}
                  onChange={() => handleCardSelect(tarjeta)}
                />
                <div className="card-option-content">
                  <div className="card-icon">
                    {tarjeta.tipoTarjeta === "CREDITO" ? "💳" : "🏧"}
                  </div>
                  <div className="card-details">
                    <p className="card-holder">{tarjeta.nombreTitular}</p>
                    <p className="card-number">
                      {tarjeta.tipoTarjeta === "CREDITO" ? "Tarjeta de crédito" : "Tarjeta de débito"}
                    </p>
                    <p className="card-last-digits">**** {tarjeta.numeroTarjeta.slice(-4)}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          <button 
            className="btn-add-card"
            onClick={handleAddCardClick}
          >
            + Agregar nueva tarjeta de {tarjetas[0]?.tipoTarjeta === "CREDITO" ? "débito" : "crédito"}
          </button>
        </>
      ) : (
        <button 
          className="btn-add-card-primary"
          onClick={handleAddCardClick}
        >
          Agregar tarjeta
        </button>
      )}
    </div>
  );
}

export default CardSelection;
