import React, { useState, useEffect } from "react";
import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import products from "../../assets/products.json";
import "./Regalospage.css";

function Regalospage() {
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    setGifts(products);
  }, []);

  return (
    <div className="regalospage">
      <Header />
      <div className="gifts-container">
        <main className="gifts-main">
          <h2>Regalos con Opciones</h2>
          <div className="cards-container">
            {gifts.map((gift) => (
              <Card key={gift.id} {...gift} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Regalospage;
