import React from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";

const ItemCart = ({ info }) => {
  const dispatch = useDispatch();
  const totalamountprice = info.precio * info.amount;

  return (
    <div className="cart-item">
      <img
        src={info.imagen_url || "/placeholder.svg"}
        alt={info.nombre}
        className="cart-item-img"
      />
      <div className="cart-item-details">
        <h4 className="cart-item-title">{info.nombre}</h4>
        <p className="cart-item-desc">{info.descripcion}</p>
        <div className="cart-item-meta">
          <span className="cart-item-qty">
            <button
              className="qty-btn"
              onClick={() => dispatch(removeFromCart(info))}
            >
              -
            </button>
            <span className="qty-number">{info.amount}</span>
            <button
              className="qty-btn"
              onClick={() => dispatch(addToCart(info))}
            >
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
