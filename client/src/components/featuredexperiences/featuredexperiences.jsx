"use client";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductos,
  selectProductos,
  selectProductosLoading,
  selectProductosError,
} from "../../redux/productosSlices";
import Card from "../card/Card";
import "./FeaturedExperiences.css";

function FeaturedExperiences() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const productos = useSelector(selectProductos);
  const loading = useSelector(selectProductosLoading);
  const error = useSelector(selectProductosError);

  useEffect(() => {
    dispatch(fetchProductos());
  }, [dispatch]);

  if (error) {
    return (
      <div className="featured-experiences">
        <div className="featured-header">
          <h2>Experiencias destacadas</h2>
        </div>
        <div
          style={{ textAlign: "center", padding: "1.5rem", color: "#d946ef" }}
        >
          <p>Error al cargar productos: {error}</p>
          <button
            onClick={() => dispatch(fetchProductos())}
            style={{ marginTop: "1rem" }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="featured-experiences">
        <div className="featured-header">
          <h2>Experiencias destacadas</h2>
        </div>
        <p style={{ textAlign: "center", padding: "1.5rem" }}>
          Cargando productos...
        </p>
      </div>
    );
  }

  // Show only first 4 products as featured
  const featuredProducts = productos.slice(0, 4);

  return (
    <div className="featured-experiences">
      <div className="featured-header">
        <h2>Experiencias destacadas</h2>
        <button
          className="view-all-btn"
          onClick={() => navigate("/experiencias")}
        >
          Ver todas →
        </button>
      </div>

      <div className="featured-grid">
        {featuredProducts.map((product) => (
          <Card
            key={product.id}
            id={product.id}
            nombre={product.nombre}
            descripcion={product.descripcion}
            precio={product.precio}
            imagen_url={product.imagen_url}
            ubicacion={product.ubicacion}
            cant_personas={product.cant_personas}
            stock={product.stock}
            descuento={product.descuento}
          />
        ))}
      </div>
    </div>
  );
}

export default FeaturedExperiences;
