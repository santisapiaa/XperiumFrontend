"use client"

import { useState } from "react"

function CategoryFilter({ categories, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(true)

  const handleCategoryFilter = (category) => {
    onFilterChange({ category })
  }

  return (
    <div className="filter-section">
      <div
        className="section-title"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
      >
        <span>Categorías</span>
        <span>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <div className="section-content">
          {categories.map((category, index) => (
            <label key={index}>
              <input type="radio" name="category" onChange={() => handleCategoryFilter(category)} />
              {category}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryFilter
