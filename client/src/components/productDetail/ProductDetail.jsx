"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductoById,
  clearCurrentProducto,
  selectCurrentProducto,
  selectProductosLoading,
  selectProductosError,
} from "../../redux/productosSlices";
import { addToCart } from "../../redux/cartSlice";
import Header from "../header/Header";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentProducto = useSelector(selectCurrentProducto);
  const loading = useSelector(selectProductosLoading);
  const error = useSelector(selectProductosError);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (location.state?.product) {
      // Si viene del state de navegación, no necesitamos hacer fetch
      return;
    }

    dispatch(fetchProductoById(id));

    // Cleanup al desmontar
    return () => {
      dispatch(clearCurrentProducto());
    };
  }, [id, location.state, dispatch]);

  const product = location.state?.product || currentProducto;

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          imagen_url: product.imagenUrl || product.imagen_url,
          ubicacion: product.ubicacion,
          cant_personas: product.cantPersonas || product.cant_personas,
          stock: product.stock,
          amount: quantity,
        })
      );
      alert(`${quantity} ${product.nombre} agregado(s) al carrito`);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (error && !location.state?.product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="product-detail-error">
          <p style={{ color: "#d946ef" }}>
            Error al cargar el producto: {error}
          </p>
          <button
            onClick={() => dispatch(fetchProductoById(id))}
            className="btn-back"
          >
            Reintentar
          </button>
          <button onClick={() => navigate(-1)} className="btn-back">
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (loading && !location.state?.product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="product-detail-loading">
          <p>Cargando producto...</p>
        </div>
      </div>
    );
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
    );
  }

  const precioOriginal =
    product.descuento > 0
      ? product.precio / (1 - product.descuento / 100)
      : null;

  return (
    <div className="product-detail-page">
      <Header />

      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="btn-back-arrow">
          ← Volver
        </button>

        <div className="product-detail-content">
          <div className="product-detail-image-section">
            {product.descuento > 0 && (
              <div className="product-detail-discount-badge">
                -{product.descuento}%
              </div>
            )}
            <img
              src={
                product.imagenUrl || product.imagen_url || "/placeholder.svg"
              }
              alt={product.nombre}
              className="product-detail-image"
            />
          </div>

          <div className="product-detail-info-section">
            <div className="product-detail-header">
              <h1 className="product-detail-title">{product.nombre}</h1>
              <span className="product-detail-location">
                {product.ubicacion}
              </span>
            </div>

            <div className="product-detail-price-section">
              {product.descuento > 0 && (
                <span className="product-detail-price-original">
                  ${precioOriginal.toLocaleString()}
                </span>
              )}
              <span className="product-detail-price">
                ${product.precio.toLocaleString()}
              </span>
            </div>

            <div className="product-detail-meta">
              <div className="product-detail-meta-item">
                <span className="meta-label">Personas:</span>
                <span className="meta-value">
                  {product.cantPersonas || product.cant_personas}
                </span>
              </div>
            </div>

            <div className="product-detail-description">
              <h2>Descripción</h2>
              <p>{product.descripcion}</p>
            </div>

            <div className="product-detail-actions">
              <div className="quantity-selector">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-add-to-cart-detail"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
