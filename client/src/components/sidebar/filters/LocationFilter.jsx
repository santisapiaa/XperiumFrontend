"use client"

import { useState, useEffect } from "react"
import "../sidebar.css"

function LocationFilter({ onFilterChange, locations = [], resetKey }) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(() => {
    if (resetKey > 0) {
      setSelectedLocation(null)
    }
  }, [resetKey])

  const handleLocationChange = (location) => {
    setSelectedLocation(location)
    onFilterChange({ location })
  }

  const locationOptions = ["Todos", ...locations]

  return (
    <div className="filter-section">
      <div
        className="section-title"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
      >
        <span>Ubicación</span>
        <span>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <div className="section-content">
          {locationOptions.map((location) => (
            <label key={location}>
              <input
                type="radio"
                name="location"
                checked={selectedLocation === location || (location === "Todos" && !selectedLocation)}
                onChange={() => handleLocationChange(location === "Todos" ? null : location)}
              />
              {location}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default LocationFilter
