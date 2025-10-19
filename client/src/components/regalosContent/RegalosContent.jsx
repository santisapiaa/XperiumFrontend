"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import Card from "../card/Card"
import Header from "../header/Header"
import Sidebar from "../sidebar/sidebar"
import { productosAPI, categoriasAPI } from "../../services/api"
import "./RegalosContent.css"

function RegalosContent() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const categoryParam = searchParams.get("categoria") || ""

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

        const products = (productsResponse.content || productsResponse).map((product) => ({
          ...product,
          imagen_url: product.imagenUrl || product.imagen_url,
          cant_personas: product.cantPersonas || product.cant_personas,
        }))
        setGifts(products)

        if (categoryParam) {
          setFilters((prev) => ({ ...prev, category: decodeURIComponent(categoryParam) }))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        alert("Error al cargar productos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryParam])

  const uniqueCategories = useMemo(() => {
    const categories = Array.from(new Set(gifts.map((p) => categoriesMap[p.categoriaId]).filter(Boolean)))
    return categories
  }, [gifts, categoriesMap])

  const uniqueLocations = useMemo(() => {
    const locations = Array.from(new Set(gifts.map((p) => p.ubicacion))).filter(Boolean)
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
    const searchOk = (() => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      const nameMatch = gift.nombre?.toLowerCase().includes(query)
      const descMatch = gift.descripcion?.toLowerCase().includes(query)
      return nameMatch || descMatch
    })()

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

    return searchOk && priceOk && categoryOk && locationOk && peopleOk
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
          {searchQuery ? (
            <h2>Resultados para: "{searchQuery}"</h2>
          ) : categoryParam ? (
            <h2>Categoría: {decodeURIComponent(categoryParam)}</h2>
          ) : (
            <h2>Regalos con Opciones</h2>
          )}
          <div className="cards-container">
            {filteredGifts.length > 0 ? (
              filteredGifts.map((gift) => <Card key={gift.id} {...gift} descuento={gift.descuento} />)
            ) : (
              <p style={{ textAlign: "center", width: "100%", padding: "2rem" }}>
                No se encontraron resultados para tu búsqueda.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default RegalosContent
