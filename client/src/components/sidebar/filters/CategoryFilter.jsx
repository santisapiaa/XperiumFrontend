"use client"

import { useState, useEffect } from "react"

function CategoryFilter({ categories, onFilterChange, resetKey }) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    if (resetKey > 0) {
      setSelectedCategory(null)
    }
  }, [resetKey])

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category)
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
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category}
                onChange={() => handleCategoryFilter(category)}
              />
              {category}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryFilter
