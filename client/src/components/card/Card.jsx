import React, { useContext } from "react";
import "./Card.css";
import { CartContext } from "../../context/CartContext";

function Card({
  id,
  nombre,
  descripcion,
  precio,
  imagen_url,
  ubicacion,
  cant_personas,
  stock,
}) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card">
      <img src={imagen_url} alt={nombre} />
      <div className="card-info">
        <div className="card-header">
          <h3>{nombre}</h3>
          <span className="ubicacion">{ubicacion}</span>
        </div>
        <p>{descripcion}</p>
        <div className="card-footer">
          <span className="precio">${precio.toLocaleString()}</span>
          <span className="personas">{cant_personas} personas</span>
          <div>
            <button
              className="btn-agregar-al-carrito"
              onClick={() =>
                addToCart({
                  id,
                  nombre,
                  descripcion,
                  precio,
                  imagen_url,
                  ubicacion,
                  cant_personas,
                  stock,
                  amount: 1,
                })
              }
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
