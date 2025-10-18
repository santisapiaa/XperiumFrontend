"use client"

import { useState, useEffect } from "react"
import "../sidebar.css"

function PeopleFilter({ onFilterChange, resetKey }) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedPeople, setSelectedPeople] = useState(null)

  useEffect(() => {
    if (resetKey > 0) {
      setSelectedPeople(null)
    }
  }, [resetKey])

  const handlePeopleChange = (people) => {
    setSelectedPeople(people)
    onFilterChange({ people })
  }

  const peopleOptions = [
    { label: "Todos", value: null },
    { label: "1 persona", value: 1 },
    { label: "2 personas", value: 2 },
    { label: "3+ personas", value: 3 },
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
        <span>Cantidad de Personas</span>
        <span>{isOpen ? "−" : "+"}</span>
      </div>
      {isOpen && (
        <div className="section-content">
          {peopleOptions.map((option) => (
            <label key={option.label}>
              <input
                type="radio"
                name="people"
                checked={selectedPeople === option.value || (option.value === null && selectedPeople === null)}
                onChange={() => handlePeopleChange(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default PeopleFilter
