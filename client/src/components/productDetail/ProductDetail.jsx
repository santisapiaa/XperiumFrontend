"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { productosAPI } from "../../services/api"
import { CartContext } from "../../context/CartContext"
import Header from "../header/Header"
import "./ProductDetail.css"

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useContext(CartContext)

  const [product, setProduct] = useState(location.state?.product || null)
  const [loading, setLoading] = useState(!location.state?.product)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (location.state?.product) {
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        const data = await productosAPI.getById(id)
        const normalizedProduct = {
          ...data,
          imagen_url: data.imagenUrl || data.imagen_url,
          cant_personas: data.cantPersonas || data.cant_personas,
        }
        setProduct(normalizedProduct)
      } catch (error) {
        console.error("Error fetching product:", error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, location.state])

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        imagen_url: product.imagen_url,
        ubicacion: product.ubicacion,
        cant_personas: product.cant_personas,
        stock: product.stock,
        amount: quantity,
      })
      alert(`${quantity} ${product.nombre} agregado(s) al carrito`)
    }
  }

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="product-detail-loading">
          <p>Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="product-detail-error">
          <p>Producto no encontrado</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            Volver
          </button>
        </div>
      </div>
    )
  }

  const precioOriginal = product.descuento > 0 ? product.precio / (1 - product.descuento / 100) : null

  return (
    <div className="product-detail-page">
      <Header />

      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="btn-back-arrow">
          ← Volver
        </button>

        <div className="product-detail-content">
          <div className="product-detail-image-section">
            {product.descuento > 0 && <div className="product-detail-discount-badge">-{product.descuento}%</div>}
            <img src={product.imagen_url || "/placeholder.svg"} alt={product.nombre} className="product-detail-image" />
          </div>

          <div className="product-detail-info-section">
            <div className="product-detail-header">
              <h1 className="product-detail-title">{product.nombre}</h1>
              <span className="product-detail-location">{product.ubicacion}</span>
            </div>

            <div className="product-detail-price-section">
              {product.descuento > 0 && (
                <span className="product-detail-price-original">${precioOriginal.toLocaleString()}</span>
              )}
              <span className="product-detail-price">${product.precio.toLocaleString()}</span>
            </div>

            <div className="product-detail-meta">
              <div className="product-detail-meta-item">
                <span className="meta-label">Personas:</span>
                <span className="meta-value">{product.cant_personas}</span>
              </div>
            </div>

            <div className="product-detail-description">
              <h2>Descripción</h2>
              <p>{product.descripcion}</p>
            </div>

            <div className="product-detail-actions">
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="quantity-btn">
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="quantity-btn">
                  +
                </button>
              </div>

              <button onClick={handleAddToCart} className="btn-add-to-cart-detail">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
