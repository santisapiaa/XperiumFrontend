"use client"

import { useState } from "react"
import "../sidebar.css"

function LocationFilter({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState(null)

  const handleLocationChange = (location) => {
    setSelectedLocation(location)
    onFilterChange({ location })
  }

  const locations = [
    "Todos",
    "CABA",
    "Buenos Aires",
    "Luján, Buenos Aires",
    "Capilla del Señor, Buenos Aires",
    "San Isidro, Buenos Aires",
    "Tigre, Buenos Aires",
  ]

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
          {locations.map((location) => (
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
