import React, { useState, useEffect } from "react";
import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Sidebar from "../../components/sidebar/sidebar";
import products from "../../assets/products.json";
import "./Regalospage.css";

function Regalospage() {
  const [gifts, setGifts] = useState([]);
  const [filters, setFilters] = useState({ minPrice: null, maxPrice: null, category: null });

  useEffect(() => {
    setGifts(products);
  }, []);

  // Extract categories from products (based on nombre or ubicacion — here we consider nombre keywords)
  const uniqueCategories = Array.from(
    new Set(
      products.map((p) => {
        // Try to map product names to friendly categories
        if (/gourmet|cocina|clase/i.test(p.nombre)) return "Experiencia Gourmet";
        if (/relax|masaje/i.test(p.nombre)) return "Relax";
        return "Acción";
      })
    )
  );

  const handleFilterChange = (newFilter) => {
    if (newFilter.reset) {
      setFilters({ minPrice: null, maxPrice: null, category: null });
      return;
    }
    setFilters((prev) => ({ ...prev, ...newFilter }));
  };

  const filteredGifts = gifts.filter((gift) => {
    const priceOk = (() => {
      if (filters.minPrice == null && filters.maxPrice == null) return true;
      const min = filters.minPrice ?? -Infinity;
      const max = filters.maxPrice ?? Infinity;
      return gift.precio >= min && gift.precio <= max;
    })();

    const categoryOk = (() => {
      if (!filters.category) return true;
      return (
        (filters.category === "Experiencia Gourmet" && /gourmet|cocina|clase/i.test(gift.nombre)) ||
        (filters.category === "Relax" && /relax|masaje/i.test(gift.nombre)) ||
        (filters.category === "Acción" && !/gourmet|cocina|clase|relax|masaje/i.test(gift.nombre))
      );
    })();

    return priceOk && categoryOk;
  });

  return (
    <div className="regalospage">
      <Header />
      <div className="gifts-container">
        <Sidebar onFilterChange={handleFilterChange} categories={uniqueCategories} />
        <main className="gifts-main">
          <h2>Regalos con Opciones</h2>
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

export default Regalospage;
