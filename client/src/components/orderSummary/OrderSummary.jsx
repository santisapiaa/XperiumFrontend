import "./OrderSummary.css";

function OrderSummary({ cartItems, total }) {
  const shipping = 0; // Envío gratis por ahora

  return (
    <div className="order-summary">
      <h3>Resumen de compra</h3>
      
      <div className="summary-items">
        {cartItems.map((item) => (
          <div key={item.id} className="summary-item">
            <span className="item-name">{item.nombre}</span>
            <span className="item-price">$ {Number(item.precio).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="summary-divider"></div>

      <div className="summary-row">
        <span>Envío</span>
        <span className={shipping === 0 ? "free-shipping" : ""}>
          {shipping === 0 ? "Gratis" : `$ ${shipping.toLocaleString()}`}
        </span>
      </div>

      <div className="summary-row">
        <span className="coupon-text">Ingresar código de cupón</span>
        <span></span>
      </div>

      <div className="summary-divider"></div>

      <div className="summary-total">
        <span>Pagás</span>
        <span className="total-amount">$ {total.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default OrderSummary;
