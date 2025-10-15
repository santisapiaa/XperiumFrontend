"use client";
import PriceFilter from "./filters/PriceFilter";
import CategoryFilter from "./filters/CategoryFilter";
import LocationFilter from "./filters/LocationFilter";
import PeopleFilter from "./filters/PeopleFilter";
import "./sidebar.css";

function Sidebar({
  onFilterChange,
  categories,
  showCategoryFilter = true,
  showPriceFilter = true,
  showLocationFilter = true,
  showPeopleFilter = true,
}) {
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

      {showPriceFilter && <PriceFilter onFilterChange={onFilterChange} />}
      {showCategoryFilter && categories && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          onFilterChange={onFilterChange}
        />
      )}
      {showLocationFilter && <LocationFilter onFilterChange={onFilterChange} />}
      {showPeopleFilter && <PeopleFilter onFilterChange={onFilterChange} />}
    </aside>
  );
}

export default Sidebar;
