"use client";

// This file intentionally left minimal to avoid casing conflicts on Windows.
// The real Eventospage component lives in Eventospage.jsx (same folder).

export const EVENTS_PAGE_ALIAS = true;
import { useState, useEffect } from "react";
import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/sidebar";
import products from "../../assets/products.json";
import "./Eventospage.css";

function Eventospage() {
  const [gifts, setGifts] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const handleFilterChange = (category) => {
    // Implement filter logic here
  };

  useEffect(() => {
    setGifts(products);
    const categories = [...new Set(products.map((p) => p.categoria))];
    setUniqueCategories(categories);
  }, []);

  const isEvent = (p) => p.categoria === "Evento";
  const eventGifts = gifts.filter((g) => isEvent(g));

  return (
    <div className="eventospage">
      <Header />
      <div className="gifts-container">
        <Sidebar
          onFilterChange={handleFilterChange}
          categories={uniqueCategories}
        />
        <main className="gifts-main">
          <h2>Eventos</h2>
          <div className="cards-container">
            {eventGifts.map((gift) => (
              <Card key={gift.id} {...gift} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Eventospage;
