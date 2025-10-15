"use client"

import { useState } from "react"

function PriceFilter({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(true)

  const priceRanges = [
    { label: "Hasta $42.000", range: [0, 42000] },
    { label: "De $42.000 a $96.000", range: [42000, 96000] },
    { label: "De $96.000 a $209.000", range: [96000, 209000] },
    { label: "Más de $209.000", range: [209000, Number.POSITIVE_INFINITY] },
  ]

  const handlePriceFilter = (range) => {
    const [min, max] = range
    onFilterChange({
      minPrice: min,
      maxPrice: max,
    })
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
        <span>Precio</span>
        <span>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <div className="section-content">
          {priceRanges.map((priceRange, index) => (
            <label key={index}>
              <input type="radio" name="price" onChange={() => handlePriceFilter(priceRange.range)} />
              {priceRange.label}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default PriceFilter
