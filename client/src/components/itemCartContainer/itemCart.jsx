import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";

const ItemCart = ({ info }) => {
  const { addToCart, deleteToCart } = useContext(CartContext);
  const totalamountprice = info.precio * info.amount;

  return (
    <div className="cart-item">
      <img src={info.imagen_url} alt={info.nombre} className="cart-item-img" />
      <div className="cart-item-details">
        <h4 className="cart-item-title">{info.nombre}</h4>
        <p className="cart-item-desc">{info.descripcion}</p>
        <div className="cart-item-meta">
          <span className="cart-item-qty">
            <button className="qty-btn" onClick={() => deleteToCart(info)}>
              -
            </button>
            <span className="qty-number">{info.amount}</span>
            <button className="qty-btn" onClick={() => addToCart(info)}>
              +
            </button>
          </span>
          <span className="cart-item-price">
            Subtotal: <b>${totalamountprice.toLocaleString()}</b>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemCart;
