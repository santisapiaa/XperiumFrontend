import React, { useState } from "react";
import "./sidebar.css";

function Sidebar({ onFilterChange, categories: propCategories }) {
  const [openSections, setOpenSections] = useState({
    price: true,
    categories: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceFilter = (range) => {
    const [min, max] = range;
    onFilterChange({
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleCategoryFilter = (category) => {
    onFilterChange({ category });
  };

  const priceRanges = [
    { label: "Hasta $42.000", range: [0, 42000] },
    { label: "De $42.000 a $96.000", range: [42000, 96000] },
    { label: "De $96.000 a $209.000", range: [96000, 209000] },
    { label: "Más de $209.000", range: [209000, Infinity] },
  ];

  // Use categories passed from parent (Regalospage). If none provided, fall back to defaults.
  const categories = propCategories && propCategories.length ? propCategories : ["Relax", "Experiencia Gourmet"];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Filtrar</h3>
        <button
          className="clear-btn"
          onClick={() => onFilterChange({ reset: true })}
          aria-label="Limpiar filtros"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Sección Precio */}
      <div className="filter-section">
        <div
          className="section-title"
          onClick={() => toggleSection("price")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && toggleSection("price")}
        >
          <span>Precio</span>
          <span>{openSections.price ? "−" : "+"}</span>
        </div>
        {openSections.price && (
          <div className="section-content">
            {priceRanges.map((priceRange, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="price"
                  onChange={() => handlePriceFilter(priceRange.range)}
                />
                {priceRange.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sección Categorías */}
      <div className="filter-section">
        <div
          className="section-title"
          onClick={() => toggleSection("categories")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && toggleSection("categories")}
        >
          <span>Categorías</span>
          <span>{openSections.categories ? "−" : "+"}</span>
        </div>
        {openSections.categories && (
          <div className="section-content">
            {categories.map((category, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="category"
                  onChange={() => handleCategoryFilter(category)}
                />
                {category}
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
