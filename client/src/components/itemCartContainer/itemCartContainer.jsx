"use client";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  selectCartItems,
  selectCartItemsCount,
  clearCart,
} from "../../redux/cartSlice";
import { crearOrden } from "../../redux/ordenesSlice";
import { selectIsAuthenticated, selectUser } from "../../redux/authSlice";
import ItemCart from "./itemCart";
import { Link, useNavigate } from "react-router-dom";
import "./ItemCartContainer.css";

const ItemCartContainer = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const productsLength = useSelector(selectCartItemsCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (previous, current) =>
      previous + Number(current.precio) * Number(current.amount),
    0
  );

  const handleComprar = async () => {
    if (!isAuthenticated || !user) {
      alert("❌ Debes iniciar sesión para realizar una compra.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("❌ El carrito está vacío.");
      return;
    }

    navigate("/checkout");
  };

  return (
    <main className="cart-main">
      <h2>Carrito</h2>
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>No hay productos agregados.</p>
          <Link to="/experiencias">Ir a la tienda</Link>
        </div>
      ) : (
        <div>
          <div className="cart-container">
            <button onClick={() => dispatch(clearCart())} disabled={loading}>
              Vaciar carrito
            </button>
            <div className="cart-items">
              {cartItems.map((item) => (
                <ItemCart info={item} key={item.id} />
              ))}
            </div>
            <div className="cart-total">
              <span>Total: ${total.toLocaleString()}</span>
              <span>({productsLength} productos)</span>
              <button onClick={handleComprar} disabled={loading}>
                {loading ? "Procesando..." : "Comprar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ItemCartContainer;
