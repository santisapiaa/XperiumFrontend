"use client"
import { useState } from "react"
import PriceFilter from "./filters/PriceFilter"
import CategoryFilter from "./filters/CategoryFilter"
import LocationFilter from "./filters/LocationFilter"
import PeopleFilter from "./filters/PeopleFilter"
import "./sidebar.css"

function Sidebar({
  onFilterChange,
  categories,
  locations,
  showCategoryFilter = true,
  showPriceFilter = true,
  showLocationFilter = true,
  showPeopleFilter = true,
}) {
  const [resetKey, setResetKey] = useState(0)

  const handleClearFilters = () => {
    onFilterChange({ reset: true })
    setResetKey((prev) => prev + 1)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Filtrar</h3>
        <button className="clear-btn" onClick={handleClearFilters} aria-label="Limpiar filtros">
          Limpiar filtros
        </button>
      </div>

      {showPriceFilter && <PriceFilter onFilterChange={onFilterChange} resetKey={resetKey} />}
      {showCategoryFilter && categories && categories.length > 0 && (
        <CategoryFilter categories={categories} onFilterChange={onFilterChange} resetKey={resetKey} />
      )}
      {showLocationFilter && (
        <LocationFilter onFilterChange={onFilterChange} locations={locations} resetKey={resetKey} />
      )}
      {showPeopleFilter && <PeopleFilter onFilterChange={onFilterChange} resetKey={resetKey} />}
    </aside>
  )
}

export default Sidebar
