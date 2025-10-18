"use client"

import { useState, useEffect, useMemo } from "react"
import Card from "../card/Card"
import Header from "../header/Header"
import Sidebar from "../sidebar/sidebar"
import { productosAPI, categoriasAPI } from "../../services/api"
import "./RegalosContent.css"

function RegalosContent() {
  const [gifts, setGifts] = useState([])
  const [categoriesMap, setCategoriesMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    category: null,
    location: null,
    people: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productosAPI.getAll(),
          categoriasAPI.getAll(),
        ])

        const categories = categoriesResponse.content || categoriesResponse
        const catMap = {}
        categories.forEach((cat) => {
          catMap[cat.id] = cat.descripcion
        })
        setCategoriesMap(catMap)
        console.log("[v0] Mapa de categorías:", catMap)

        const products = (productsResponse.content || productsResponse).map((product) => ({
          ...product,
          imagen_url: product.imagenUrl || product.imagen_url,
          cant_personas: product.cantPersonas || product.cant_personas,
        }))
        console.log("[v0] Productos cargados:", products)
        console.log("[v0] Cantidad de productos:", products.length)
        setGifts(products)
      } catch (error) {
        console.error("Error fetching data:", error)
        alert("Error al cargar productos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const uniqueCategories = useMemo(() => {
    const categories = Array.from(new Set(gifts.map((p) => categoriesMap[p.categoriaId]).filter(Boolean)))
    console.log("[v0] Categorías únicas calculadas:", categories)
    console.log("[v0] Cantidad de categorías:", categories.length)
    return categories
  }, [gifts, categoriesMap])

  const uniqueLocations = useMemo(() => {
    const locations = Array.from(new Set(gifts.map((p) => p.ubicacion))).filter(Boolean)
    console.log("[v0] Ubicaciones únicas calculadas:", locations)
    return locations
  }, [gifts])

  const handleFilterChange = (newFilter) => {
    if (newFilter.reset) {
      setFilters({
        minPrice: null,
        maxPrice: null,
        category: null,
        location: null,
        people: null,
      })
      return
    }
    setFilters((prev) => ({ ...prev, ...newFilter }))
  }

  const filteredGifts = gifts.filter((gift) => {
    const priceOk = (() => {
      if (filters.minPrice == null && filters.maxPrice == null) return true
      const min = filters.minPrice ?? Number.NEGATIVE_INFINITY
      const max = filters.maxPrice ?? Number.POSITIVE_INFINITY
      return gift.precio >= min && gift.precio <= max
    })()

    const categoryOk = (() => {
      if (!filters.category) return true
      return categoriesMap[gift.categoriaId] === filters.category
    })()

    const locationOk = (() => {
      if (!filters.location) return true
      return gift.ubicacion === filters.location
    })()

    const peopleOk = (() => {
      if (filters.people === null) return true
      if (filters.people === 3) {
        return gift.cant_personas >= 3
      }
      return gift.cant_personas === filters.people
    })()

    return priceOk && categoryOk && locationOk && peopleOk
  })

  if (loading) {
    return (
      <div className="regalospage">
        <Header />
        <div className="gifts-container">
          <p style={{ textAlign: "center", padding: "2rem" }}>Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="regalospage">
      <Header />
      <div className="gifts-container">
        <Sidebar
          onFilterChange={handleFilterChange}
          categories={uniqueCategories}
          locations={uniqueLocations}
          showCategoryFilter={true}
          showPriceFilter={true}
        />
        <main className="gifts-main">
          <h2>Regalos con Opciones</h2>
          <div className="cards-container">
            {filteredGifts.map((gift) => (
              <Card key={gift.id} {...gift} descuento={gift.descuento} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default RegalosContent
