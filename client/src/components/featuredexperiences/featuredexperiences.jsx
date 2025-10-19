"use client"

import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Card from "../card/Card"
import "./FeaturedExperiences.css"
import { productosAPI } from "../../services/api"

function FeaturedExperiences() {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const productsResponse = await productosAPI.getAll()
        const products = (productsResponse.content || productsResponse).map((product) => ({
          ...product,
          imagen_url: product.imagenUrl || product.imagen_url,
          cant_personas: product.cantPersonas || product.cant_personas,
        }))
        setFeaturedProducts(products.slice(0, 4))
      } catch (error) {
        console.error("Error fetching featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  if (loading) {
    return (
      <div className="featured-experiences">
        <div className="featured-header">
          <h2>Experiencias destacadas</h2>
        </div>
        <p style={{ textAlign: "center", padding: "1.5rem" }}>Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="featured-experiences">
      <div className="featured-header">
        <h2>Experiencias destacadas</h2>
        <button className="view-all-btn" onClick={() => navigate("/experiencias")}>
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
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturedExperiences

