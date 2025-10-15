// This file intentionally left minimal to avoid casing conflicts on Windows.
// The real Eventospage component lives in Eventospage.jsx (same folder).

export const EVENTS_PAGE_ALIAS = true;
import React, { useState, useEffect } from "react";
import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Sidebar from "../../components/sidebar/sidebar";
import products from "../../assets/products.json";
import "./Eventospage.css";

function Eventospage() {
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    setGifts(products);
  }, []);

const isEvent = p => p.categoria === 'Evento';
  const eventGifts = gifts.filter((g) => isEvent(g));

  return (
    <div className="eventospage">
      <Header />
      <div className="gifts-container">
        <Sidebar onFilterChange={handleFilterChange} categories={uniqueCategories} />
        <main className="gifts-main">
          <h2>Eventos</h2>
          <div className="cards-container">
            {eventGifts.map((gift) => (
              <Card key={gift.id} {...gift} />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Eventospage;