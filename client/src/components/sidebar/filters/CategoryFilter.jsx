"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategorias } from "../../../redux/categoriasSlice";

function CategoryFilter({ categories, onFilterChange, resetKey }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();

  const categoriasFromRedux = useSelector(
    (state) => state.categorias.items || []
  );
  const categoriasToUse =
    categories || categoriasFromRedux.map((cat) => cat.nombre);

  useEffect(() => {
    if (
      !categories &&
      (!categoriasFromRedux || categoriasFromRedux.length === 0)
    ) {
      dispatch(fetchCategorias());
    }
  }, [categories, categoriasFromRedux.length, dispatch]);

  useEffect(() => {
    if (resetKey > 0) {
      setSelectedCategory(null);
    }
  }, [resetKey]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    onFilterChange({ category });
  };

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
          {categoriasToUse.map((category, index) => (
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
  );
}

export default CategoryFilter;
