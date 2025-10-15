import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import ItemCart from "./itemCart";
import { Link } from "react-router-dom";
import "./ItemCartContainer.css";

const ItemCartContainer = () => {
  const { cartItems, deleteAll, productsLength } = useContext(CartContext);

  // ¡Usa current.precio!
  const total = cartItems.reduce(
    (previous, current) =>
      previous + Number(current.precio) * Number(current.amount),
    0
  );

  return (
    <main className="cart-main">
      <h2>Carrito</h2>
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>No hay productos agregados.</p>
          <Link to="/">Ir a la tienda</Link>
        </div>
      ) : (
        <div>
          <div className="cart-container">
            <button onClick={deleteAll}>Vaciar carrito</button>
            <div className="cart-items">
              {cartItems.map((item) => (
                <ItemCart info={item} key={item.id} />
              ))}
            </div>
            <div className="cart-total">
              <span>Total: ${total.toLocaleString()}</span>
              <span>({productsLength} productos)</span>
              <button>Comprar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ItemCartContainer;
