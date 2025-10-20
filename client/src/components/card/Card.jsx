"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import "./Card.css"
import { CartContext } from "../../context/CartContext"

function Card({ id, nombre, descripcion, precio, imagen_url, ubicacion, cant_personas, stock, descuento }) {
  const { addToCart } = useContext(CartContext)
  const navigate = useNavigate()

  const precioOriginal = descuento > 0 ? precio / (1 - descuento / 100) : null

  const handleCardClick = (e) => {
    if (e.target.closest(".btn-agregar-al-carrito")) {
      return
    }
    navigate(`/producto/${id}`, {
      state: {
        product: {
          id,
          nombre,
          descripcion,
          precio,
          imagen_url,
          ubicacion,
          cant_personas,
          stock,
          descuento,
        },
      },
    })
  }

  return (
    <div className="card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="card-image-container">
        {descuento > 0 && <div className="discount-badge">-{descuento}%</div>}
        <img src={imagen_url || "/placeholder.svg"} alt={nombre} />
      </div>

      <div className="card-title-container">
        <h3>{nombre}</h3>
        <span className="ubicacion">{ubicacion}</span>
      </div>

      <div className="card-description-container">
        <p>{descripcion}</p>
      </div>

      <div className="card-footer-container">
        <div className="precio-container">
          {descuento > 0 && <span className="precio-original">${precioOriginal.toLocaleString()}</span>}
          <span className="precio">${precio.toLocaleString()}</span>
        </div>
        <span className="personas">{cant_personas} personas</span>
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
  )
}

export default Card
