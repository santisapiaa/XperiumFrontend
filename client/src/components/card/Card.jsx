"use client"

import { useContext } from "react"
import "./Card.css"
import { CartContext } from "../../context/CartContext"

function Card({
  id,
  nombre,
  descripcion,
  precio,
  imagen_url,
  ubicacion,
  cant_personas,
  stock,
  descuento, // Added descuento prop
}) {
  const { addToCart } = useContext(CartContext)

  const precioOriginal = descuento > 0 ? precio / (1 - descuento / 100) : null

  return (
    <div className="card">
      {descuento > 0 && <div className="discount-badge">-{descuento}%</div>}
      <img src={imagen_url || "/placeholder.svg"} alt={nombre} />
      <div className="card-info">
        <div className="card-header">
          <h3>{nombre}</h3>
          <span className="ubicacion">{ubicacion}</span>
        </div>
        <p>{descripcion}</p>
        <div className="card-footer">
          <div className="precio-container">
            {descuento > 0 && <span className="precio-original">${precioOriginal.toLocaleString()}</span>}
            <span className="precio">${precio.toLocaleString()}</span>
          </div>
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
  )
}

export default Card
