"use client";

import { useState, useEffect } from "react";
import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/sidebar";
import products from "../../assets/products.json";
import "./Eventospage.css";

export default function Eventos() {
  const [gifts, setGifts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    category: null,
    location: null,
    people: null,
  });

  useEffect(() => {
    setGifts(products.filter((p) => p.categoria === "Evento"));
  }, []);

  const handleFilterChange = (newFilter) => {
    if (newFilter.reset) {
      setFilters({
        minPrice: null,
        maxPrice: null,
        category: null,
        location: null,
        people: null,
      });
      return;
    }
    setFilters((prev) => ({ ...prev, ...newFilter }));
  };

  const filteredGifts = gifts.filter((gift) => {
    const priceOk = (() => {
      if (filters.minPrice == null && filters.maxPrice == null) return true;
      const min = filters.minPrice ?? Number.NEGATIVE_INFINITY;
      const max = filters.maxPrice ?? Number.POSITIVE_INFINITY;
      return gift.precio >= min && gift.precio <= max;
    })();

    const categoryOk = (() => {
      if (!filters.category) return true;
      return gift.categoria === filters.category;
    })();

    const locationOk = (() => {
      if (!filters.location) return true;
      return gift.ubicacion === filters.location;
    })();

    const peopleOk = (() => {
      if (filters.people === null) return true;
      if (filters.people === 3) {
        // 3+ personas
        return gift.cant_personas >= 3;
      }
      return gift.cant_personas === filters.people;
    })();

    return priceOk && categoryOk && locationOk && peopleOk;
  });

  // categories available in events (likely only 'Evento' but keep dynamic)
  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.categoria))
  ).filter(Boolean);

  return (
    <div className="eventospage">
      <Header />
      <div className="gifts-container">
        <Sidebar
          onFilterChange={handleFilterChange}
          categories={uniqueCategories}
          showCategoryFilter={false}
          showPriceFilter={true}
        />
        <main className="gifts-main">
          <h2>Eventos</h2>
          <div className="cards-container">
            {filteredGifts.map((gift) => (
              <Card key={gift.id} {...gift} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
