import React, { useState, useEffect } from "react";
import Card from "../../components/card/Card";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./Regalospage.css";

function Regalospage() {
  const [gifts, setGifts] = useState([]);

  // Simulación de fetch (acá iría tu backend real)
  useEffect(() => {
    fetch("/api/gifts")
      .then((res) => res.json())
      .then((data) => setGifts(data))
      .catch(() => {
        // Datos mockeados si el backend no responde
        setGifts([
          {
            id: 1,
            title: "Acción",
            description: "Deportes y actividades para disfrutar.",
            price: 29000,
            rating: 4.8,
            image:
              "https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg",
          },
          {
            id: 2,
            title: "Relax",
            description: "Masajes y tratamientos corporales.",
            price: 44000,
            rating: 4.7,
            image:
              "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg",
          },
          {
            id: 3,
            title: "Experiencia Gourmet",
            description: "Cenas y almuerzos en los mejores restaurantes.",
            price: 94000,
            rating: 4.7,
            image:
              "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg",
          },
        ]);
      });
  }, []);

  return (
    <div className="regalospage">
      <Header />
      <div className="gifts-container">
        {/* Si tienes un Sidebar, impórtalo y descomenta la siguiente línea */}
        {/* <Sidebar /> */}
        <main className="gifts-main">
          <h2>Regalos con Opciones</h2>
          <div className="cards-container">
            {gifts.map((gift) => (
              <Card key={gift.id} {...gift} />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Regalospage;
