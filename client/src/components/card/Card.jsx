import React from "react";
import "./Card.css";

function Card({ title, description, price, rating, image }) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <div className="card-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="card-footer">
          <span className="precio">${price.toLocaleString()}</span>
          <span className="puntaje">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
