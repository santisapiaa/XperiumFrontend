import { useState } from "react";
import CardSelection from "../cardSelection/CardSelection";
import "./PaymentMethods.css";

function PaymentMethods({ onSelect, selected }) {
  const [expandedSection, setExpandedSection] = useState("recomendados");
  const [showAddCard, setShowAddCard] = useState(false);

  const paymentOptions = {
    recomendados: [
      {
        id: "cards",
        label: "Mis tarjetas",
        description: "Usar tarjeta guardada",
        type: "card",
        component: CardSelection,
      },
    ],
    mercadopago: [
      {
        id: "mp-money",
        label: "Dinero disponible",
        description: "Saldo: $ 68.322,28",
        icon: "💰",
        type: "mercadopago",
      },
    ],
    otros: [
      {
        id: "transferencia",
        label: "Transferencia bancaria",
        description: "Transferencia directa",
        icon: "🏦",
        type: "transferencia",
      },
      {
        id: "efectivo",
        label: "Efectivo",
        description: "Pago en efectivo",
        icon: "💵",
        type: "efectivo",
      },
    ],
  };

  const handleSelectPayment = (option) => {
    if (option.type === "card") {
      setExpandedSection("cards-details");
    } else {
      onSelect({
        type: option.type,
        details: option.id,
      });
      setExpandedSection(null);
    }
  };

  return (
    <div className="payment-methods">
      <h2>Elegí cómo pagar</h2>

      {/* Sección Recomendados - Tarjetas */}
      <section className="payment-section">
        <h3>Recomendados</h3>
        <CardSelection 
          onSelect={onSelect}
          selected={selected}
          onAddNew={() => setShowAddCard(true)}
        />
      </section>

      {/* Sección Mercado Pago */}
      <section className="payment-section">
        <h3>Mercado Pago</h3>
        {paymentOptions.mercadopago.map((option) => (
          <label key={option.id} className="payment-option">
            <input
              type="radio"
              name="payment"
              value={option.id}
              checked={selected?.details === option.id && selected?.type === "mercadopago"}
              onChange={() => handleSelectPayment(option)}
            />
            <div className="payment-option-content">
              <span className="payment-icon">{option.icon}</span>
              <div>
                <p className="payment-label">{option.label}</p>
                <p className="payment-description">{option.description}</p>
              </div>
            </div>
          </label>
        ))}
      </section>

      {/* Sección Otros medios de pago */}
      <section className="payment-section">
        <h3>Otros medios de pago</h3>
        {paymentOptions.otros.map((option) => (
          <label key={option.id} className="payment-option">
            <input
              type="radio"
              name="payment"
              value={option.id}
              checked={selected?.details === option.id && selected?.type === option.type}
              onChange={() => handleSelectPayment(option)}
            />
            <div className="payment-option-content">
              <span className="payment-icon">{option.icon}</span>
              <div>
                <p className="payment-label">{option.label}</p>
                <p className="payment-description">{option.description}</p>
              </div>
            </div>
          </label>
        ))}
      </section>
    </div>
  );
}

export default PaymentMethods;
