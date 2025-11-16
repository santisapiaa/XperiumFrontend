import React from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/cartSlice";
import "./itemCart.css";

export default function ItemCart({ item }) {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(addToCart(item));
  };

  const handleDecrement = () => {
    dispatch(removeFromCart(item));
  };

  return (
    <div className="item-cart">
      <img
        src={item.imagen || "/placeholder.svg?height=80&width=80"}
        alt={item.nombre}
        className="item-cart-image"
      />
      <div className="item-cart-info">
        <h4>{item.nombre}</h4>
        <p className="item-cart-price">${item.precio}</p>
      </div>
      <div className="item-cart-controls">
        <button onClick={handleDecrement} className="btn-control">
          -
        </button>
        <span className="item-cart-amount">{item.amount}</span>
        <button onClick={handleIncrement} className="btn-control">
          +
        </button>
      </div>
      <div className="item-cart-subtotal">
        ${(item.precio * item.amount).toFixed(2)}
      </div>
    </div>
  );
}
