"use client"

import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { categoriasAPI } from "../../services/api"
import "./CategoryCarousel.css"

function CategoryCarousel() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriasAPI.getAll()
        const categoriesData = response.content || response
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleCategoryClick = (category) => {
    navigate(`/experiencias?categoria=${encodeURIComponent(category.descripcion)}`)
  }

  if (loading) {
    return (
      <div className="category-carousel-container">
        <div className="category-carousel-header">
          <h2>Explorá por categoría</h2>
          <p>Encontrá la experiencia perfecta para cada momento</p>
        </div>
        <p style={{ textAlign: "center", padding: "2rem" }}>Cargando categorías...</p>
      </div>
    )
  }

  return (
    <div className="category-carousel-container">
      <div className="category-carousel-header">
        <h2>Explorá por categoría</h2>
        <p>Encontrá la experiencia perfecta para cada momento</p>
      </div>

      <div className="category-carousel-wrapper">
        <button className="category-scroll-btn left" onClick={() => scroll("left")} aria-label="Scroll left">
          ‹
        </button>

        <div className="category-carousel" ref={scrollRef}>
          {categories.map((category) => (
            <div key={category.id} className="category-card" onClick={() => handleCategoryClick(category)}>
              <div
                className="category-image"
                style={{
                  backgroundImage: `url(${category.imagenUrl || "/placeholder.svg?height=300&width=400&query=" + encodeURIComponent(category.descripcion)})`,
                }}
              />
              <div className="category-info">
                <h3>{category.descripcion}</h3>
                <p>{category.nombre || "Experiencias únicas"}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="category-scroll-btn right" onClick={() => scroll("right")} aria-label="Scroll right">
          ›
        </button>
      </div>
    </div>
  )
}

export default CategoryCarousel
