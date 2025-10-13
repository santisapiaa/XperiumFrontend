import React, { useState, useEffect } from "react";
import "./Carousel.css";

const images = [
  {
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    title: "Cena romántica bajo las estrellas",
    subtitle: "Restaurantes y experiencias gourmet",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    title: "Aventura y adrenalina",
    subtitle: "Saltos, rafting y más",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    title: "Relajación total",
    subtitle: "Masajes y spa premium",
  },
];

function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrent((current + 1) % images.length);
  const prevSlide = () => setCurrent((current - 1 + images.length) % images.length);

  return (
    <div className="carousel">
      {images.map((img, index) => (
        <div
          key={index}
          className={`slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${img.src})` }}
        >
          <div className="overlay">
            <h2>{img.title}</h2>
            <p>{img.subtitle}</p>
          </div>
        </div>
      ))}

      <button className="prev" onClick={prevSlide}>‹</button>
      <button className="next" onClick={nextSlide}>›</button>
    </div>
  );
}

export default Carousel;
